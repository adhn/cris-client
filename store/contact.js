import gql from 'graphql-tag';
// import graphqlClient from '~/plugins/graphql';
// let client = graphqlClient()
import {mergeWith} from 'lodash';
import {POLL_INTERVAL, NO_POLL} from './constants'

const omitDeep = require("omit-deep-lodash");

const MUTATION_SAVE_CONTACT = gql`
mutation SaveContact($contact:ContactInputType) {
    CreateUpdateContact(ContactInput:$contact) {
    id
  	}
}
`

const QUERY_GET_CONTACT = gql`
query GetContact(
    $contact_id:Int!
    $companies_per_page: Int,
    $companies_page: Int,
    $projects_per_page: Int
    $projects_page: Int
) {
    contact(id:$contact_id) {
      id
      assistant_name
      birthday
      business_home_page
      business_phones
      children
      company_name
      department
      display_name
      file_as
      generation
      given_name
      home_phones
      im_addresses
      initials
      job_title
      manager
      middle_name
      mobile_phone
      nick_name
      office_location
      personal_notes
      profession
      spouse_name
      surname
      title
      yomi_company_name
      yomi_given_name
      yomi_surname
      emailAddresses {
        id,email,display_name
      }
      businessAddress {
        id,city,country_or_region,postal_code,state,street
      }
      homeAddress {
        id,city,country_or_region,postal_code,state,street
      }
      otherAddress {
        id,city,country_or_region,postal_code,state,street
      }
    	projects {
        id,project_role_id,name
      }
    	companies {
        id,name
      }
    }
  	projectRoles {
      id,role,display
    }
    projects(
        per_page: $projects_per_page,
        page: $projects_page
    ) {
        total
        data {
            id
            name
        }
    }
    companies(
        per_page: $companies_per_page,
        page: $companies_page
    ) {
        total
        data {
            id
            name
        }
    }
  }
`

const QUERY_GET_COMPANIES_PROJECTS_PROJECT_ROLES = gql `
query GetCompaniesProjectProjectRoles(
    $projects_per_page: Int,
    $projects_page: Int,
    $companies_per_page: Int,
    $companies_page: Int
) {
    projects(
        per_page: $projects_per_page,
        page: $projects_page
    ) {
        total
        data {
            id,name
        }
    }
    companies(
        per_page: $companies_per_page,
        page: $companies_page
    ) {
        total
        data {
            id,name
        }
    }
    projectRoles {
        id,role,display
    }
}
`
// to better document these perhaps a class should be created PhysicalAddress 
const physicalAddressTemplate = {
    street: '',
    postal_code:'',
    city:'',
    state:'',
    country_or_region:''
};

const projectTemplate = {
    name: '',
    project_role_id: null
};

const companyTemplate = {
    name: ''
}

const getProjectById = function (state,key,id) {
    var result = state.projects.find(obj => {
        return obj.id === id
    })

    // change project
    let project_role_id = state.contactProjects[key]['project_role_id']
    let project = Object.assign({project_role_id: project_role_id},result)

    return project
}
const getCompanyById = function (state,id) {
    var result = state.companies.find(obj => {
        return obj.id === id
    })
    return result
}


// to better document these perhaps a class should be created EmailAddress 
const emailAddressTemplate = { display_name: '',email:''};

export const state = () => ({
        editContactId: -1,
        editContactDisplayName: '',
        showFieldToggles: { // these fields are only relevant to ContactFormName, and might better be refactored there
            middle_name: true,
            title: true,
            // suffix: false,
            yomi_given_name: false,
            yomi_surname: false,
            yomi_company_name: false // this field is only relevant to ContactFormWork and might better be refactored there 
        },
        projectRoles: [],
        projects: [],
        companies: [],
        contact: {},
        readonly:true,
        contactEmailAddresses: [],
        contactImAddresses: [],
        contactHomePhones: ['',''],
        contactBusinessPhones: ['',''],
        contactBusinessAddress: null,
        contactHomeAddress: null,
        contactOtherAddress: null,
        contactProjects: [],
        contactCompanies: [],
        default: {
            id: null,
            given_name: '',
            surname: '',
            middle_name:'',
            title: '',
            // suffix: '',
            yomi_given_name: '',
            yomi_surname: '',
            // emailAddresses: [
            //     Object.assign({},emailAddressTemplate)
            // ],
            // home_phones: ['',''],
            // business_phones: ['',''],
            mobile_phone: '',
            // im_addresses: [''],
            job_title:'',
            department:'',
            company_name:'',
            office_location:'',
            manager:'',
            assistant_name:'',
            yomi_company_name:'',

            // business_address_id: 0,
            // home_address_id: 0,
            // other_address_id: 0,
            // businessAddress: Object.assign({},physicalAddressTemplate),
            // homeAddress: Object.assign({},physicalAddressTemplate),
            // otherAddress: Object.assign({},physicalAddressTemplate),
            // businessAddress: null, 
            // homeAddress: null,
            // otherAddress: null,

            birthday: '',
            nick_name: '',
            spouse_name: '',
            personal_notes: '',
            // projects: [],
            // companies: []
        },
})

export const getters = {
    isNew: state => !state.editContactId ? true: false, 
    // contactDialogOpen: state => state.contactDialogOpen,
    showMiddleName: state => state.showFieldToggles.middle_name,
    showTitle: state => state.showFieldToggles.title,
    // showSuffix: state => state.showFieldToggles.suffix,
    showYomiGivenName: state => state.showFieldToggles.yomi_given_name,
    showYomiSurname: state => state.showFieldToggles.yomi_surname,
    showYomiCompanyName: state => state.showFieldToggles.yomi_company_name,
    contact: state => state.contact,

    given_name: state => state.contact.given_name,
    surname: state => state.contact.surname,
    middle_name: state => state.contact.middle_name,
    title: state => state.contact.title,
    // suffix: state => state.contact.suffix,
    yomi_given_name: state => state.contact.yomi_given_name,
    yomi_surname: state => state.contact.yomi_surname,

    emailAddresses: state => state.contactEmailAddresses,
    business_phones: state => state.contactBusinessPhones,
    home_phones: state => state.contactHomePhones,
    im_addresses: state => state.contactImAddresses,
    businessAddress: state => state.contactBusinessAddress,
    homeAddress: state => state.contactHomeAddress,
    otherAddress: state => state.contactOtherAddress,
    contactProjects: state => state.contactProjects,
    contactCompanies: state => state.contactCompanies,

    mobile_phone: state => state.contact.mobile_phone,
    job_title: state => state.contact.job_title,
    department: state => state.contact.department,
    company_name: state => state.contact.company_name,
    office_location: state => state.contact.office_location,
    manager: state => state.contact.manager,
    assistant_name: state => state.contact.assistant_name,
    yomi_company_name: state => state.contact.yomi_company_name,

    birthday: state => state.contact.birthday,
    nick_name: state => state.contact.nick_name,
    spouse_name: state => state.contact.spouse_name,
    personal_notes: state => state.contact.personal_notes,
    contactLoading: state => state.contactLoading,
    editContactDisplayName: state => state.editContactDisplayName,
    projects: state => state.projects,
    companies: state => state.companies,
    projectRoles: state => state.projectRoles,
    readonly: state => state.readonly,
    editContactId: state => state.editContactId
}

export const actions = {
    /**
     * Saves the contact to server
     * through context we can access context.commit, context.state and context.getters
     * @param {*} context 
     */
    async save({state,commit,dispatch}) {
        let client = this.app.apolloProvider.defaultClient
        commit('contactLoading',true)
        commit('clearContactBeforeSaving')

        // removeProps(state.contact,['__typename']);
        const response = await client.mutate({
            mutation: MUTATION_SAVE_CONTACT,
            variables: { contact: state.contact }   
        }).then(function(response) {
            dispatch('contact_list/fetchData',{refresh:true},{root:true})
            
            // TODO, iterate through all companies and projects associated and refetch?

            commit('contactLoading',false)
            // trigger the setContact mutation
            // commit('setContact', {contact:response.data.contact})
            commit('feedback_snackbar/showSnackbar',{
                text: 'Contact saved succesfully'
            },{ root: true })
            return dispatch('contact_list/fetchData',null,{root:true})
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when saving message: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },
    async fetchData({commit}) {
        let client = this.app.apolloProvider.defaultClient
            // commit('reset')
            // commit('newContact')
            const response = await client.query({query: QUERY_GET_COMPANIES_PROJECTS_PROJECT_ROLES})
            .then(function(response) {
                commit('setProjectRoles',response.data.projectRoles)
                commit('setProjects',response.data.projects.data)
                commit('setCompanies',response.data.companies.data)
            })
    },

    async refresh({commit,dispatch,state}) {
        dispatch('editContact'.state.editContactId)
    },

    async editContact({commit},contactId) {
        let client = this.app.apolloProvider.defaultClient
        commit('reset')
        commit('editContactId',contactId)
        // state.editContactDisplayName = contactItem.display_name
        
        
        let observableQuery =  client.watchQuery({
            query: QUERY_GET_CONTACT,
            variables: { 
                contact_id: contactId,
                "companies_per_page": 99999,
                "companies_page": 1,
                "projects_per_page": 99999,
                "projects_page": 1
            },
            pollInterval: NO_POLL
        })
        
        // this.$queryRegistry.add('QUERY_GET_CONTACT',observableQuery)
        
        
        observableQuery.subscribe({
            next: (response) => {
                commit('setContact', {contact:response.data.contact});
                commit('contactEmailAddresses',[...response.data.contact.emailAddresses])
                commit('contactImAddresses',[...response.data.contact.im_addresses])
                commit('contactHomePhones',[...response.data.contact.home_phones])
                commit('contactBusinessPhones',[...response.data.contact.business_phones])
                commit('contactHomeAddress',response.data.contact.homeAddress)
                commit('contactBusinessAddress',response.data.contact.businessAddress)
                commit('contactOtherAddress',response.data.contact.otherAddress)
                commit('contactProjects',[...response.data.contact.projects])
                commit('contactCompanies',[...response.data.contact.companies])
                commit('editContactDisplayName',response.data.contact.display_name)
                commit('setProjectRoles',response.data.projectRoles)
                commit('setProjects',response.data.projects.data)
                commit('setCompanies',response.data.companies.data)            },
            error: (error, done) => {

            }
        })
        
    }
}

export const mutations = {
    clearContactBeforeSaving(state) {
        _.remove(state.contact.projects, function (e) {
            return e.id ? false : true
        });
    
        _.remove(state.contact.companies, function (e) {
            return e.id ? false : true
        });
    
        let contactObject = Object.assign({},state.contact)
        contactObject.projects = omitDeep(state.contactProjects,'name')
        contactObject.companies = omitDeep(state.contactCompanies,'name')

        contactObject.emailAddresses = state.contactEmailAddresses
        contactObject.im_addresses = state.contactImAddresses
        contactObject.home_phones = state.contactHomePhones
        contactObject.business_phones = state.contactBusinessPhones
        
        contactObject.homeAddress = state.contactHomeAddress
        contactObject.businessAddress = state.contactBusinessAddress
        contactObject.otherAddress = state.contactOtherAddress
        
        state.contact = Object.assign({},omitDeep(contactObject,'__typename'))
    },

    setCompanies(state,payload) {
        state.companies = payload
    },
    setProjects(state,payload) {
        state.projects = payload
    },
    setProjectRoles(state,payload) {
        let displayProjectRoles = _.filter(payload, function(o) { 
            return o.display; 
          });
      
        state.projectRoles = displayProjectRoles

        // state.projectRoles = payload
    },
    contactLoading(state,payload) {
        state.contactLoading = payload
    },
    reset(state) {

        state.editContactId = 0
        // mergeWith(
        //     state.contact, state.default, {},
        //     (a, b) => b === null ? a : undefined
        // )
        state.contactEmailAddresses = []
        state.contactImAddresses = []
        state.contactHomePhones = ['','']
        state.contactBusinessPhones = ['','']
        
        state.contactBusinessAddress = null
        state.contactOtherAddress = null
        state.contactHomeAddress = null
        state.contactProjects = [],
        state.contactCompanies = [],

        state.contact = Object.assign({},state.default)
        // state.contact.emailAddresses = Object.assign({},state.default.emailAddresses)
        // state.contact = Object.assign({},state.default)
        // this.$set(state.contact, 'emailAddresses', [
        //     Object.assign({},emailAddressTemplate)
        // ])
        state.editContactDisplayName = ''

    },
    newContact(state) {
        // https://stackoverflow.com/questions/44033997/how-do-i-merge-two-objects-while-omitting-null-values-with-lodash
        mergeWith(
            state.contact, state.default, {},
            (a, b) => b === null ? a : undefined
        )
    },
    editContactDisplayName(state,payload) {
        state.editContactDisplayName = payload
    },
    editContactId(state,payload) { 
        state.editContactId = payload
    },
    /**
     * Prepares the contact state for a new contact to be created, and opens the contact edit dialog
     * @param {*} state 
     */
    // newContact (state) {
    //     state.editContactId = 0
    //     state.contact = Object.assign({},state.default)
    // },


    /**
     * Simple opens and closes the edit/new Contact Dialog (ContactForm)
     * @param {*} state 
     */
    // openContactDialog (state) {
    //     state.contactDialogOpen = true
    // },
    // closeContactDialog (state) {
    //     state.contactDialogOpen = false
    // },
    
    // TODO: probably no reason for these ContactFormName toggles to be in the state at all
    toggleShowMiddleName (state) {
        state.showFieldToggles.middle_name = !state.showFieldToggles.middle_name
    },
    toggleShowTitle (state) {
        state.showFieldToggles.title = !state.showFieldToggles.title
    },
    // toggleShowSuffix (state) {
    //     state.showFieldToggles.suffix = !state.showFieldToggles.suffix
    // },
    toggleShowYomiGivenName (state) {
        state.showFieldToggles.yomi_given_name = !state.showFieldToggles.yomi_given_name
    },
    toggleShowYomiSurname (state) {
        state.showFieldToggles.yomi_surname = !state.showFieldToggles.yomi_surname
    },



    /**
     * Updates any of the properties on state.contact 
     * Specify the property names to be altered and their values as properties on payload 
     * @param {*} state 
     * @param {*} payload 
     */
    updateContact (state,payload) {
        delete payload.type
        state.contact = Object.assign(state.contact,payload)
    },

    contactEmailAddresses(state,payload) {
        state.contactEmailAddresses = payload
    },

    /**
     * Adds Email address object template to the email_addresses array
     * Vue has wrapped .push on Array, making this array mutation reactive,
     * See https://vuejs.org/v2/guide/list.html#Caveats and https://vuejs.org/2016/02/06/common-gotchas/ 
     * @param {*} state 
     */
    addEmailAddress(state) {
        state.contactEmailAddresses.push(Object.assign({},emailAddressTemplate))
        console.info(state.contactEmailAddresses)
    },

    addEmailAddressAndSetValues(state,payload) {
        state.contactEmailAddresses.push(Object.assign({},emailAddressTemplate,payload))
    },
    /**
     * Removes Email address from the array given by payload.key / array index, splice is also wrapped by Vue to be reactive
     * @param {*} state 
     * @param {*} payload 
     */
    removeEmailAddress(state,payload) {
        state.contactEmailAddresses.splice(payload.key,1)
    },

    /**
     * @param {*} state 
     * @param {*} payload 
     */
    updateEmailAddress(state,payload) {

        state.contactEmailAddresses[payload.key][payload.field] = payload.value
    },

    contactProjects(state,payload) {
        state.contactProjects = payload
    },

    addProject(state) {
        state.contactProjects.push(Object.assign({},projectTemplate))
    },
    removeProject(state,payload) {
        state.contactProjects.splice(payload.key,1)
    },
    updateProject(state,payload) {
        if(payload.field == 'id') {

            let project = getProjectById(state,payload.key,payload.value);
            console.info(project)
            state.contactProjects[payload.key] = project
        }

        if(payload.field == 'project_role_id') {
            // only update project role id
            state.contactProjects[payload.key][payload.field] = payload.value
        }
    },

    contactCompanies(state,payload) {
        state.contactCompanies = payload
    },

    addCompany(state) {
        state.contactCompanies.push(Object.assign({},companyTemplate))
    },
    removeCompany(state,payload) {
        state.contactCompanies.splice(payload.key,1)
    },
    updateCompany(state,payload) {
        // console.info('updateCompany',payload)
            // change company
        let company = Object.assign({},getCompanyById(state,payload.value))
        console.info('updateCompany company',company)
        state.contactCompanies[payload.key] = company
    },

    contactImAddresses(state,payload) {
        state.contactImAddresses = payload
    },

    addInstantMessagingAddress(state) {
        state.contactImAddresses.push('')
    },

    addInstantMessagingAddressWithValue(state,payload) {
        state.contactImAddresses.push(payload)
    },
    
    removeInstantMessagingAddress(state,payload) {
        state.contactImAddresses.splice(payload.key,1)
    },
    updateInstantMessagingAddress(state,payload) {
        state.contactImAddresses[payload.key] = payload.value
    },

    contactHomePhones(state,payload) {
        state.contactHomePhones = payload
    },
    contactBusinessPhones(state,payload) {
        state.contactBusinessPhones = payload
    },

    updatePhone(state,payload) {
        if(payload.field == 'business_phones') {
            state.contactBusinessPhones.splice(payload.key,1,payload.value)
        }

        if(payload.field == 'home_phones') {
            state.contactHomePhones.splice(payload.key,1,payload.value)
        }

        // state.contact[payload.field][payload.key] = payload.value
    },
    mobile_phone(state,payload) {
        state.contact.mobile_phone = payload
    },
    setContact(state,payload) {
        // state.contact = Object.assign({},state.default,payload.contact)
        // console.info(payload.contact)
        // state.contact = {}
        mergeWith(
            state.contact, state.default, payload.contact,
            (a, b) => b === null ? a : undefined
        )
        // state.contact = Object.assign({},state.contact)

        // state.contact = payload.contact
    },

    contactHomeAddress(state,payload) {
        state.contactHomeAddress = payload
    },
    contactBusinessAddress(state,payload) {
        state.contactBusinessAddress = payload
    },
    contactOtherAddress(state,payload) {
        state.contactOtherAddress = payload
    },
    readonly(state,payload) {
        state.readonly = payload
    },


    addPhysicalAddress(state,payload) {
        switch(payload.physicalAddressType) {
            case 'businessAddress':
                state.contactBusinessAddress = Object.assign({},physicalAddressTemplate)
                break;
            case 'homeAddress':
                state.contactHomeAddress = Object.assign({},physicalAddressTemplate)
                break;
            case 'otherAddress':
                state.contactOtherAddress = Object.assign({},physicalAddressTemplate)
                break;
        }
        // vm.$set(state.contact, payload.physicalAddressType, Object.assign({},physicalAddressTemplate))
        // state.contact[payload.physicalAddressType] = Object.assign({},physicalAddressTemplate)
    },

    addPhysicalAddressWithValues(state,payload) {
        switch(payload.physicalAddressType) {
            case 'businessAddress':
                state.contactBusinessAddress = Object.assign({},physicalAddressTemplate,payload.physicalAddress)
                break;
            case 'homeAddress':
                state.contactHomeAddress = Object.assign({},physicalAddressTemplate,payload.physicalAddress)
                break;
            case 'otherAddress':
                state.contactOtherAddress = Object.assign({},physicalAddressTemplate,payload.physicalAddress)
                break;
        }
        // vm.$set(state.contact, payload.physicalAddressType, Object.assign({},physicalAddressTemplate))
        // state.contact[payload.physicalAddressType] = Object.assign({},physicalAddressTemplate)
    },
    
    removePhysicalAddress(state,payload) {
        switch(payload.physicalAddressType) {
            case 'businessAddress':
                state.contactBusinessAddress = null
                break;
            case 'homeAddress':
                state.contactHomeAddress = null
                break;
            case 'otherAddress':
                state.contactOtherAddress = null
                break;
        }
        // state.contact[payload.physicalAddressType] = null
    },
    updatePhysicalAddress(state,payload) {
        // physicalAddressType
        // field
        // value
        if(payload.physicalAddressType == 'businessAddress') {
            if(!state.contactBusinessAddress) state.contactBusinessAddress = Object.assign({},physicalAddressTemplate)
            state.contactBusinessAddress[payload.field] = payload.value
        }

        if(payload.physicalAddressType == 'homeAddress') {
            if(!state.contactHomeAddress) state.contactHomeAddress = Object.assign({},physicalAddressTemplate)
            state.contactHomeAddress[payload.field] = payload.value
        }

        if(payload.physicalAddressType == 'otherAddress') {
            if(!state.contactOtherAddress) state.contactOtherAddress = Object.assign({},physicalAddressTemplate)
            state.contactOtherAddress[payload.field] = payload.value
        }

        // if(!state.contact.hasOwnProperty(payload.physicalAddressType) ){
        //     state.contact[payload.physicalAddressType] = Object.assign({},physicalAddressTemplate)
        // }
        // state.contact[payload.physicalAddressType][payload.field] = payload.value 
    }
};
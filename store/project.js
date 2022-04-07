import gql from 'graphql-tag';
import {mergeWith} from 'lodash';
import {POLL_INTERVAL, NO_POLL} from './constants'

const omitDeep = require("omit-deep-lodash");

const QUERY_GET_PROJECT = gql`
query GetProject($project_id:Int!) {
    project(id:$project_id) {
        id
        name
        active
        action_date
        progress_todo
        progress_total
        whiteboard_1
        whiteboard_2
        whiteboard_3
        onedrive_folder_location
        projectType {
            id
            name
        }
      companies {
            id
            name
            project_role_id
      }
    	issuerCountry {
        id,name
      }
    	guarantorCountry {
        id,name
      }
    	underlying_stock_name
    	underlyingStockCountry {
        id,name
      }
    	issuerCompany {
        id,name
      }
    	guarantorCompany {
        id,name
      },
        category{
        id
        display_name
        colorPreset {
          id
          constant
          name
          html
        }
      }
    	bondInformation {
        id
        description
        isin
        initial_size
        current_amount_outstanding
        coupon
        convertible_or_exchangeable
        mandatory
        secured
        hedge
        contingent_conversion
        price_or_ratio
        current_1
        current_2
        current_date
        issue_date
        maturity_date
        soft_call_date
        defaultSettlementOption {
          id
          option
          key
        }
        settlementOptions {
          id
          option
          key
        }
        currency {
          id
          code
          name
        }
      }
    	feeStructure {
        id
        acceptance_fee
        annual_fee
        settlement_calculation_fee
        settlement_calculation_fee_cap
        currency {
          id
          code
          name
        }
      }
    
    }  
} 
`

const MUTATION_SAVE_PROJECT = gql`
mutation SaveProject($project:ProjectInputType) {
    CreateUpdateProject(ProjectInput:$project) {
        id
        name
        active
        action_date
        progress_todo
        progress_total
        whiteboard_1
        whiteboard_2
        whiteboard_3
        onedrive_folder_location
        projectType {
            id
            name
        }
      companies {
            id
            name
            project_role_id
      }
    	issuerCountry {
        id,name
      }
    	guarantorCountry {
        id,name
      }
    	underlying_stock_name
    	underlyingStockCountry {
        id,name
      }
    	issuerCompany {
        id,name
      }
    	guarantorCompany {
        id,name
      },
        category{
        id
        display_name
        colorPreset {
          id
          constant
          name
          html
        }
      }
    	bondInformation {
        id
        description
        isin
        initial_size
        current_amount_outstanding
        coupon
        convertible_or_exchangeable
        mandatory
        secured
        hedge
        contingent_conversion
        price_or_ratio
        current_1
        current_2
        current_date
        issue_date
        maturity_date
        soft_call_date
        defaultSettlementOption {
          id
          option
          key
        }
        settlementOptions {
          id
          option
          key
        }
        currency {
          id
          code
          name
        }
      }
    	feeStructure {
        id
        acceptance_fee
        annual_fee
        settlement_calculation_fee
        settlement_calculation_fee_cap
        currency {
          id
          code
          name
        }
      }
  	}
}
`

const MUTATION_DELETE_PROJECT = gql`
mutation DeleteProjectMutation($id:Int!){
    DeleteProject(id:$id)
}
`

const MUTATION_ASSOCIATE_COMPANY_AND_PROJECT = gql `
mutation AssociateCompanyWithProject(
    $company_id:Int!
    $project_id:Int!
    $project_role_id:Int!
) {
    AssociateCompanyWithProject(
        company_id:$company_id
        project_id: $project_id
        project_role_id: $project_role_id
    ) {
    id
  	}
}
`

const MUTATION_ASSOCIATE_PROJECT_AND_CONTACT = gql `
mutation AssociateProjectWithContact(
    $contact_id:Int!
    $project_id:Int!
    $project_role_id:Int!
) {
    AssociateProjectWithContact(
        contact_id:$contact_id
        project_id: $project_id
        project_role_id: $project_role_id
    ) {
    id
  	}
}
`
const MUTATION_ASSOCIATE_PROJECT_AND_INTERACTION = gql `
mutation AssociateProjectWithInteraction(
    $project_id:Int!
    $interaction_id:Int!
) {
    AssociateProjectWithInteraction(
        project_id:$project_id
        interaction_id: $interaction_id
    ) {
        id
  	}
}
`

export const state = () => ({
    default: {
        id: null,
        name: '',
        active: true,
        action_date: null,
        progress_todo: 0,
        progress_total: 0,
        whiteboard_1: '',
        whiteboard_2: '',
        whiteboard_3: '',
        underlying_stock_name: '',
        project_type_id: null,
        issuer_country_id: null,
        guarantor_country_id: null,
        underlying_stock_country_id: null,
        issuer_company_id: null,
        guarantor_company_id: null,
        onedrive_folder_location: ''
    },

    project: {},
    bondInformation: {},
    bondInformationDefault: {
        id: null,
        description: '',
        isin: '',
        initial_size: '',
        current_amount_outstanding: '',
        coupon: '',
        issue_date: '',
        maturity_date: '',
        soft_call_date: '',
        default_settlement_option_id: null,
        currency_id: null,
        settlementOptions: [],
        convertible_or_exchangeable: 'CONVERTIBLE',
        mandatory: false,
        secured: false,
        hedge: false,
        price_or_ratio: 'PRICE',
        contingent_conversion: false,
        current_1: '',
        current_2: '',
        current_date: ''
    },
    feeStructure: {},
    feeStructureDefault: {
        id: null,
        currency_id: null,
        acceptance_fee: '',
        annual_fee: '',
        settlement_calculation_fee: '',
        settlement_calculation_fee_cap: '',
    },
    readonly: false,
    timeouts: [],
    whiteboard_1_message: '',
    whiteboard_2_message: '',
    whiteboard_3_message: ''
})

export const mutations = {
    timeouts(state,payload) {
        if(state.timeouts[payload.field]) clearTimeout(state.timeouts[payload.field])
        state.timeouts[payload.field] = payload.value
        switch(payload.field) {
            case 'whiteboard_1':
                state.whiteboard_1_message = payload.message
                break
            case 'whiteboard_2':
                state.whiteboard_2_message = payload.message
                break
            case 'whiteboard_3':
                state.whiteboard_3_message = payload.message
                break
        }
    },
    clearProjectBeforeSaving(state) {
        // https://stackoverflow.com/questions/40329742/removing-object-properties-with-lodash
        let project = _.pick(state.project, _.keys(state.default));
        state.project = Object.assign({},omitDeep(project,'__typename'))
        delete state.project.action_date
        delete state.project.progress_todo
        delete state.project.progress_total

        let bondInformation = _.pick(state.bondInformation, _.keys(state.bondInformationDefault));
        state.project.bondInformation = Object.assign({},omitDeep(bondInformation,'__typename'))
        state.project.bondInformation.settlementOptions = state.project.bondInformation.settlementOptions.map(o => o.id); 

        let feeStructure = _.pick(state.feeStructure, _.keys(state.feeStructureDefault));
        state.project.feeStructure = Object.assign({},omitDeep(feeStructure,'__typename'))
        // state.project.onedrive_folder_location = JSON.stringify(state.project.onedrive_folder_location)
        console.info('cleared',state.project)
    },
    newProject(state) {
        // https://stackoverflow.com/questions/44033997/how-do-i-merge-two-objects-while-omitting-null-values-with-lodash
        mergeWith(
            state.project, state.default, {},
            (a, b) => b === null ? a : undefined
        )
    },
    project(state,payload) {
        mergeWith(
            state.project, state.default, payload.project,
            (a, b) => b === null ? a : undefined
        )

        // guarantorCompany
        if(state.project.guarantorCompany) {
            state.project.guarantor_company_id = state.project.guarantorCompany.id
        }

        // guarantorCountry
        if(state.project.guarantorCountry) {
            state.project.guarantor_country_id = state.project.guarantorCountry.id
        }

        // issuerCountry
        if(state.project.issuerCountry) {
            state.project.issuer_country_id = state.project.issuerCountry.id
        }

        // issuerCompany
        if(state.project.issuerCompany) {
            state.project.issuer_company_id = state.project.issuerCompany.id
        }

        // projectType
        if(state.project.projectType) {
            state.project.project_type_id = state.project.projectType.id
        }
        
        // underlyingStockCountry
        if(state.project.underlyingStockCountry) {
            state.project.underlying_stock_country_id = state.project.underlyingStockCountry.id
        }

        // if(state.project.onedrive_folder_location) {
        //     state.project.onedrive_folder_location = Object.assign({},JSON.parse(state.project.onedrive_folder_location))
        //     console.info('store/project/onedrive_folder_location',state.project.onedrive_folder_location)
        // }
    },
    bondInformation(state,payload) {
        if(payload) {
            mergeWith(
                state.bondInformation, state.bondInformationDefault, payload,
                (a, b) => b === null ? a : undefined
            )

            // default settlement option
            if(state.bondInformation.defaultSettlementOption) {
                state.bondInformation.default_settlement_option_id = state.bondInformation.defaultSettlementOption.id
            }

            // project bond information
            if(state.bondInformation.currency) {
                state.bondInformation.currency_id = state.bondInformation.currency.id
            }
        }
    },
    feeStructure(state,payload) {
        if(payload) {
            mergeWith(
                state.feeStructure, state.feeStructureDefault, payload,
                (a, b) => b === null ? a : undefined
            )

            // currency
            if(state.feeStructure.currency) {
                state.feeStructure.currency_id = state.feeStructure.currency.id
            }
        }
    },
    reset(state) {
        state.project = Object.assign({},state.default)
        state.bondInformation = Object.assign({},state.bondInformationDefault)
        state.feeStructure = Object.assign({},state.feeStructureDefault)
        state.id = -1
    },
    id(state,payload) { state.project.id = payload },
    name(state,payload) { state.project.name = payload },
    active(state,payload) { state.project.active = payload },
    whiteboard_1(state,payload) { state.project.whiteboard_1 = payload },
    whiteboard_2(state,payload) { state.project.whiteboard_2 = payload },
    whiteboard_3(state,payload) { state.project.whiteboard_3 = payload },
    underlying_stock_name(state,payload) { state.project.underlying_stock_name = payload },
    project_type_id(state,payload) { state.project.project_type_id = payload },
    issuer_country_id(state,payload) { state.project.issuer_country_id = payload },
    guarantor_country_id(state,payload) { state.project.guarantor_country_id = payload },
    underlying_stock_country_id(state,payload) { state.project.underlying_stock_country_id = payload },
    issuer_company_id(state,payload) { state.project.issuer_company_id = payload },
    guarantor_company_id(state,payload) { state.project.guarantor_company_id = payload },
 
    onedrive_folder_location(state,payload) { 
        state.project.onedrive_folder_location = JSON.stringify(payload) 
    },

    // project bond information
    bondInformationDescription(state,payload) { state.bondInformation.description = payload },
    bondInformationIsin(state,payload) { state.bondInformation.isin = payload },
    bondInformationInitialSize(state,payload) { state.bondInformation.initial_size = payload },
    bondInformationCurrentAmountOutstanding(state,payload) { state.bondInformation.current_amount_outstanding = payload },
    bondInformationCoupon(state,payload) { state.bondInformation.coupon = payload },
    bondInformationIssueDate(state,payload) { state.bondInformation.issue_date = payload },
    bondInformationMaturityDate(state,payload) { state.bondInformation.maturity_date = payload },
    bondInformationSoftCallDate(state,payload) { state.bondInformation.soft_call_date = payload },
    bondInformationDefaultSettlementOptionId(state,payload) { state.bondInformation.default_settlement_option_id = payload },
    bondInformationCurrencyId(state,payload) { state.bondInformation.currency_id = payload },
    bondInformationSettlementOptions(state,payload) { state.bondInformation.settlementOptions = payload },
    bondInformationConvertibleOrExchangeable(state,payload) { 
        state.bondInformation.convertible_or_exchangeable = payload 
        console.info('store setter',state.bondInformation.convertible_or_exchangeable)
    },
    bondInformationMandatory(state,payload) { state.bondInformation.mandatory = payload },
    bondInformationSecured(state,payload) { state.bondInformation.secured = payload },
    bondInformationHedge(state,payload) { state.bondInformation.hedge = payload },
    bondInformationPriceOrRatio(state,payload) { state.bondInformation.price_or_ratio = payload },
    bondInformationContingentConversion(state,payload) { state.bondInformation.contingent_conversion = payload },
    bondInformationCurrent1(state,payload) { state.bondInformation.current_1 = payload },
    bondInformationCurrent2(state,payload) { state.bondInformation.current_2 = payload },
    bondInformationCurrentDate(state,payload) { state.bondInformation.current_date = payload },

    // fee structure
    feeStructureCurrencyId(state,payload) { state.feeStructure.currency_id = payload },
    feeStructureAcceptanceFee(state,payload) { state.feeStructure.acceptance_fee = payload },
    feeStructureAnnualFee(state,payload) { state.feeStructure.annual_fee = payload },
    feeStructureSettlementCalculationFee(state,payload) { state.feeStructure.settlement_calculation_fee = payload },
    feeStructureSettlementCalculationFeeCap(state,payload) { state.feeStructure.settlement_calculation_fee_cap = payload },
    
}

export const getters = {
    // total: state => state.total,
    isNew: state => !state.project.id ? true: false,
    readonly: state => state.readonly,
    project: state => state.project,
    projectCompanies: state => state.project.companies,
    projectCompaniesCount: state => {
        if(state.project && state.project.companies) {
            return state.project.companies.length
        } else {
            return 0
        }
    
    },
    // project fields
    id: state => state.project.id, 
    name: state => state.project.name,
    active: state => state.project.active,

    action_date: state => state.project.action_date,
    progress_todo: state => state.project.progress_todo,
    progress_total: state => state.project.progress_total,

    whiteboard_1: state => state.project.whiteboard_1,
    whiteboard_2: state => state.project.whiteboard_2,
    whiteboard_3: state => state.project.whiteboard_3,
    underlying_stock_name: state => state.project.underlying_stock_name,
    project_type_id: state => state.project.project_type_id,
    issuer_country_id: state => state.project.issuer_country_id,
    guarantor_country_id: state => state.project.guarantor_country_id,
    underlying_stock_country_id: state => state.project.underlying_stock_country_id,
    issuer_company_id: state => state.project.issuer_company_id,
    guarantor_company_id: state => state.project.guarantor_company_id,
    onedrive_folder_location: state => {
        console.info('store/project/getters/onedrive_folder_location',state.project.onedrive_folder_location)
        if(state.project.onedrive_folder_location) {
            return JSON.parse(state.project.onedrive_folder_location)
        }
        return state.project.onedrive_folder_location
        // if(typeof state.project.onedrive_folder_location !== 'Object') {
        //     return JSON.parse(state.project.onedrive_folder_location)
        // }
        // return state.project.onedrive_folder_location
    },
    timeouts: state => state.timeouts,
    whiteboard_1_message: state => state.whiteboard_1_message,
    whiteboard_2_message: state => state.whiteboard_2_message,
    whiteboard_3_message: state => state.whiteboard_3_message,

    showBondInformationAndFeeStructure: state => {
        if(state.project && (state.project.project_type_id == 1 || state.project.project_type_id == 5)) {
            return true
        } else {
            return false
        }
    },


    // project bond information
    bondInformationDescription: state => state.bondInformation.description,
    bondInformationIsin: state => state.bondInformation.isin,
    bondInformationInitialSize: state => state.bondInformation.initial_size,
    bondInformationCurrentAmountOutstanding: state => state.bondInformation.current_amount_outstanding,
    bondInformationCoupon: state => state.bondInformation.coupon,
    bondInformationIssueDate: state => state.bondInformation.issue_date,
    bondInformationMaturityDate: state => state.bondInformation.maturity_date,
    bondInformationSoftCallDate: state => state.bondInformation.soft_call_date,
    bondInformationDefaultSettlementOptionId: state => state.bondInformation.default_settlement_option_id,
    bondInformationSettlementOptions: state => state.bondInformation.settlementOptions,
    bondInformationCurrencyId: state => state.bondInformation.currency_id,
    bondInformationConvertibleOrExchangeable: state => state.bondInformation.convertible_or_exchangeable,
    bondInformationMandatory: state => state.bondInformation.mandatory,
    bondInformationSecured: state => state.bondInformation.secured,
    bondInformationHedge: state => state.bondInformation.hedge,
    bondInformationPriceOrRatio: state => state.bondInformation.price_or_ratio,
    bondInformationContingentConversion: state => state.bondInformation.contingent_conversion,
    bondInformationCurrent1: state => state.bondInformation.current_1,
    bondInformationCurrent2: state => state.bondInformation.current_2,
    bondInformationCurrentDate: state => state.bondInformation.current_date,

    // fee structure
    feeStructureCurrencyId: state => state.feeStructure.currency_id,
    feeStructureAcceptanceFee: state => state.feeStructure.acceptance_fee,
    feeStructureAnnualFee: state => state.feeStructure.annual_fee,
    feeStructureSettlementCalculationFee: state => state.feeStructure.settlement_calculation_fee,
    feeStructureSettlementCalculationFeeCap: state => state.feeStructure.settlement_calculation_fee_cap

}

export const actions = {
    async deleteProject({commit,state,dispatch},projectId) {
        let client = this.app.apolloProvider.defaultClient
        const response = await client.mutate({
            mutation: MUTATION_DELETE_PROJECT,
            variables: { id: projectId }   
        }).then(function(response) {
            dispatch('project_list/fetchProjects',{refresh:true},{root:true})
            dispatch('project_list_trashed/fetch',{refresh:true},{root:true})
            commit('feedback_snackbar/showSnackbar',{
                text: 'Project deleted succesfully'
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when deleting Project: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });       
    },

    async edit({commit},id) {
        let client = this.app.apolloProvider.defaultClient
        commit('reset')
        commit('id',id)
        let observableQuery = client.watchQuery({
            query: QUERY_GET_PROJECT,
            variables: { 
                project_id: id,
            },
            pollInterval: NO_POLL
        })

        // this.$queryRegistry.add('QUERY_GET_PROJECT',observableQuery)

        observableQuery.subscribe({
            next: (response) => {
                commit('project', {project:response.data.project});
                commit('bondInformation',response.data.project.bondInformation);
                commit('feeStructure',response.data.project.feeStructure)            },
            error: (error, done) => {

            }
        })
        
    },
    async save({state,commit,dispatch}) {
        let client = this.app.apolloProvider.defaultClient
        const newLocal = 'clearProjectBeforeSaving';
        // commit('contactLoading',true)
        commit(newLocal)
        
        // removeProps(state.contact,['__typename']);
        console.info(state.project)
        const response = await client.mutate({
            mutation: MUTATION_SAVE_PROJECT,
            variables: { project: state.project }   
        }).then(function(response) {
            // commit('contactLoading',false)
            // trigger the setContact mutation
            // commit('setContact', {contact:response.data.contact})

            if(state.project.id == null) {
                // supposedly a new company has been created, refresh
                dispatch('project_list/fetchProjects',{refresh:true},{root:true})
                // dispatch('project_list_trashed/fetch',{refresh:true},{root:true})
            } else {
                dispatch('audit_list/fetchAudits',{refresh:true},{root:true})
            }

            commit('feedback_snackbar/showSnackbar',{
                text: 'Project saved succesfully'
            },{ root: true })
            // return dispatch('contact_list/fetchData',null,{root:true})
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when saving project: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },

    async associateCompany({state,commit,dispatch},info) {
        let client = this.app.apolloProvider.defaultClient
        return await client.mutate({
            mutation: MUTATION_ASSOCIATE_COMPANY_AND_PROJECT,
            variables: { 
                company_id: info.company_id,
                project_id: state.project.id,
                project_role_id: info.project_role_id
            }   
        }).then(function(response) {

            dispatch('audit_pivot_list/fetchAuditPivots',{refresh:true},{root:true})
            dispatch('company_list/fetchCompanies',{refresh:true},{root:true})

            commit('feedback_snackbar/showSnackbar',{
                text: 'Company succesfully attached to '+state.project.name
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when attaching company to project: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },

    async associateContact({state,commit,dispatch},info) {
        let client = this.app.apolloProvider.defaultClient
        return await client.mutate({
            mutation: MUTATION_ASSOCIATE_PROJECT_AND_CONTACT,
            variables: { 
                contact_id: info.contact_id,
                project_id: state.project.id,
                project_role_id: info.project_role_id
            }   
        }).then(function(response) {

            dispatch('audit_pivot_list/fetchAuditPivots',{refresh:true},{root:true})
            dispatch('contact_list/fetchContactsFromGraphQL',{refresh:true},{root:true})

            commit('feedback_snackbar/showSnackbar',{
                text: 'Contact succesfully attached to '+state.project.name
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when attaching contact to project: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },

    async associateInteraction({state,commit,dispatch},interactionId) {
        let client = this.app.apolloProvider.defaultClient
        return await client.mutate({
            mutation: MUTATION_ASSOCIATE_PROJECT_AND_INTERACTION,
            variables: { 
                project_id: state.project.id,
                interaction_id: interactionId,
            }   
        }).then(function(response) {
            dispatch('audit_pivot_list/fetchAuditPivots',{refresh:true},{root:true})
            dispatch('interaction_list/fetchInteractions',{refresh:true},{root:true})
            commit('feedback_snackbar/showSnackbar',{
                text: 'Interaction succesfully attached to '+state.project.name
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when attaching Interaction to project: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },

    async delayed_whiteboard_autosave({state,commit,dispatch},obj) {
        commit(obj.field,obj.value)
        commit('timeouts',{
            field: obj.field,
            value: setTimeout(function() {
                dispatch('autosave',obj.field)
            }, 1000),
            message: 'waiting for you to stop typing...'
        })
    },

    async autosave({state,commit,dispatch},field) {
        commit('timeouts',{
            field: field,
            value: null,
            message: 'saving...'
        })

        let client = this.app.apolloProvider.defaultClient

        let partialProject = {
            id: state.project.id
        }
        partialProject[field] = state.project[field]


        const response = await client.mutate({
            mutation: MUTATION_SAVE_PROJECT,
            variables: {
                project: partialProject
            }   
        }).then(function(response) {
            commit('timeouts',{
                field: field,
                value: null,
                message: 'saved!'
            })
        }).catch(function(error){

        });    
    },
}
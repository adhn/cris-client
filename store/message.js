import gql from 'graphql-tag';

const QUERY_MESSAGE = gql`
query GetMessage($message_id:Int!) {
    message(id:$message_id) {
          id
      internet_message_id
      subject
      from
      to_recipients
      bcc_recipients
      cc_recipients
      body_content
      body_content_type
      contacts {
        id,display_name
        emailAddresses {
          id,display_name,email
        }
        field
      }
    }  
  }  
`

export const state = () => ({
    message: {},
    messageLoading: false
})

export const getters = {
    message: state => state.message,
    messageLoading: state => state.messageLoading,

}
export const mutations = {
    message(state,payload) {
        state.message = processMessage(state,payload)
    },
    messageLoading(state,payload) {
        state.messageLoading = payload
    },
}

export const actions = {
    async fetch({state,commit,dispatch},messageId) {
        commit('messageLoading',true)
        let client = this.app.apolloProvider.defaultClient
        const response = await client.query({
            query: QUERY_MESSAGE,
            variables: {
                message_id: messageId
            }
        })
        .then(function(response) {
            commit('message',response.data.message)
            commit('messageLoading',false)
        })
        .catch(function(error){

        });
    },
}




const processMessage = function(state,message) {
    // TODO implement this to match up to, from, cc with contact id's
        // console.info('processMessage here')
        message = _.assign({},message)

        /**
         * 
         */
        var contactsLength = message.contacts.length
        var contacts = {
            contact_from: {},
            contact_to_recipients: [],
            contact_cc_recipients: [],
            contact_bcc_recipients: [],
            to_recipients: [],
            cc_recipients: [],
            bcc_recipients: []
        }

        for(var k = 0; k < contactsLength; k++) {
            switch(message.contacts[k].field) {
                case 'FROM':
                    contacts.contact_from = message.contacts[k] 
                    break;
                case 'TO':
                    contacts.to_recipients = removeContactFromRecipientArray(message,message.contacts[k],'to_recipients')
                    contacts.contact_to_recipients.push(message.contacts[k]) 
                    break;
                case 'CC':
                    contacts.cc_recipients = removeContactFromRecipientArray(message,message.contacts[k],'cc_recipients')
                    contacts.contact_cc_recipients.push(message.contacts[k]) 
                    break;
                case 'BCC':
                    contacts.bcc_recipients = removeContactFromRecipientArray(message,message.contacts[k],'bcc_recipients')
                    contacts.contact_bcc_recipients.push(message.contacts[k])
                    break;
            }
            
        }
        message = _.assign(message,contacts)
        // console.info('message',message)
        return message
}

const removeContactFromRecipientArray = function(message,contact,recipientArray) {
    var recipients = []
    // iterate contact['emailAddresses'] as emailAddress['email']
    var emailAddressesLength = contact['emailAddresses'].length
    for (var i = 0; i < emailAddressesLength; i++) {
        var email = contact['emailAddresses'][i].email
        var recipientArrayLength = message[recipientArray].length
        // iterate message[recipientArray] as recipientString
        for (var k = 0; k < recipientArrayLength; k++) {
            var recipientString = message[recipientArray][k]
            // if recipientString contains emailAddress['email']
            var idx = recipientString.indexOf(email)
            console.info('idx',idx)
            if(idx => 0) {
                // email was found in recipientString, remove from recipientArray  
                // console.info('will we ever come here 1')
                // message[recipientArray].splice(k,1)
                recipients.push(message[recipientArray][k])
                // console.info('will we ever come here 2')
            }
        }
    }
    recipients = _.difference(message[recipientArray],recipients)
    // recipients = message[recipientArray]
    return recipients
}
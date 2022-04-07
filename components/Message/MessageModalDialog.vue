<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogMutateable" scrollable max-width="1000px" @keydown.esc="close()">
      <!-- <v-btn slot="activator" icon color="primary" dark><v-icon>open_in_new</v-icon></v-btn> -->
      <v-card>
        <v-card-title>
          <span class="headline">{{message.subject}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
                <v-flex xs2>
                    <strong>FROM:</strong>
                </v-flex>
                <v-flex xs10>
                    <from-cell-render :message="message" />
                </v-flex>

                <v-flex xs2>
                    <strong>TO:</strong>
                </v-flex>
                <v-flex xs10>
                    <to-cell-render :contactObjects="message.contact_to_recipients" :contactStrings="message.to_recipients" />
                </v-flex>

                <template v-if="message.contact_cc_recipients.length > 0 || message.cc_recipients.length > 0">
                    <v-flex xs2>
                        <strong>CC:</strong>
                    </v-flex>
                    <v-flex xs10>
                        <to-cell-render :contactObjects="message.contact_cc_recipients" :contactStrings="message.cc_recipients" />
                    </v-flex>
                </template>

                <template v-if="message.attachments.length > 0">
                    <v-flex xs2>
                        <strong>Attachments:</strong>
                    </v-flex>
                    <v-flex xs10>
                        <attachments-render :attachments="message.attachments" />
                    </v-flex>
                </template>

                <v-flex xs12>
                    <message-content-iframe ref="messageContent" :dialog="dialogMutateable" :bodyContent="message.body_content" />
                </v-flex>
            </v-layout>
          </v-container>
          <!-- <small>*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
    import FromCellRender from '~/components/MessageList/FromCellRender.vue'
    import ToCellRender from '~/components/MessageList/ToCellRender.vue'
    import MessageContentIframe from '~/components/Message/MessageContentIframe.vue'
    import AttachmentsRender from '~/components/Message/AttachmentsRender.vue'
    export default {
        props: {
            message: Object,
            dialog: {
                default: false
            }
        },
        components: {FromCellRender,ToCellRender,MessageContentIframe,AttachmentsRender},
        computed: {    },
        methods: {
            close() {
                this.dialogMutateable = false
                this.$emit('update:dialogMutateable', false)
            }
        },
        data: () => ({
            dialogMutateable: this.dialog
        }),
        watch: {
            dialogMutateable: function (val,oldVal) {
                if(val) {
                    this.$refs.messageContent.calculateHeight()
                }
            },
        },
        mounted: function() {
        
        },
        created: function() {

        },
        updated: function() {

        }
    }
</script>
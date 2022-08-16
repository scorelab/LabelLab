import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from api.helpers.email.email_template import (
    email_template
)

subject = {
    "project_membership_changed" : "Project Membership Update",
    "team_membership_changed" : "Team Membership Update",
    "admin_status" : "Role Update",
    "issue_assigned" : "Assigned Issue Update",
    "issue_assigned_updated" : "Assigned Issue Update",
    "issue_assigned_comments" : "Assigned Issue Update",
    "mentioned" : "Mentioned in chat"
}

# Configure API key authorization: api-key
def send_email(user, message, type) :
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = os.environ.get(
            "API_KEY"
    )

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        sender={"name":"LabelLab", "email":"labellab@scorelab.com"}, 
        to=[{"email": f"{user['email']}","name":f"{user['name']}"}], 
        subject= f"{subject[type]}",
        html_content= email_template(user['name'], message),
        headers={  
            "charset":"iso-8859-1"
        }
    ) # SendSmtpEmail

    try:
        # Send a transactional email
        api_response = api_instance.send_transac_email(send_smtp_email)
    except ApiException as e:
        print("Exception when calling SMTPApi->send_transac_email: %s\n" % e)




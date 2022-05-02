aws cognito-idp sign-up --region us-east-1 \
--client-id 2hb1fv676jumrla609t88neljo \
--username lfsouza.ribeiro@icloud.com \
--password Qwerty@123

aws cognito-idp admin-confirm-sign-up \
--region us-east-1 \
--user-pool-id us-east-1_jGS2B3rG2  \
--username lfsouza.ribeiro@icloud.com

aws ses verify-email-identity \
--email-address psainterviewfrom@gmail.com

aws ses verify-email-identity \
--email-address psainterviewto@gmail.com
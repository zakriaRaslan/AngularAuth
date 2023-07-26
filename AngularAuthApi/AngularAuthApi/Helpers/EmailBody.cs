namespace AngularAuthApi.Helpers
{
    public static class EmailBody
    {
        public static string EmailStringBody(string email, string emailToken)
        {
            return $@"<html>
             <head></head>
            <body style=""margin:0;padding:0;font-family:Arial,Helvetica,Sans-Serif;"">
        <div style=""height:auto;background:linear-gradient(to top , #c9c9ff 50%, #6e6ef6 90%) no-repeat; width:400px;padding:30px;"">
         <div>
            <div>
            <h1> Reset Your Password</h1>
            <hr>
                <p> You Are Reciving This E-Mail Because You Requested A Password Reset For Your Account .</p>
                <p> Please Tap The Link Below To Set A New Password.</p>
                <a href=""http://localhost:4200/reset?email={email}&code={emailToken}"" target=""_blank"">Reset Password</a> <br>
            <p>Kind Regards, <br> <br>
                Raslan</p>
         </div>
        </div>
       </div>
    </body>
</html>
";
        }
    }
}

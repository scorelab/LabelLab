def email_template (username, message) :
    template = f"""
    <!DOCTYPE html>
        <html>

        <head>
            <title>Email template</title>

            <meta property="og:title" content="Email template">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        </head>

        <body bgcolor="#F5F8FA"
            style="width: 100%; margin: auto 0; padding:0; font-family:Lato, sans-serif; font-size:18px; color:#33475B; word-break:break-word">
            <div id="email">
                <table role="presentation" width="100%">
                    <tr align="center" style="background-color: #f9e7f7;">
                        <td>
                            <img src="https://user-images.githubusercontent.com/45410599/125047461-a1ebf100-e0bc-11eb-9849-0aa7eb15156c.png"
                                width="550px" align="middle">
                        </td>
                </table>
                <table role="presentation" border="0" cellpadding="0" cellspacing="10px" style="padding: 30px 30px 30px 60px;">
                    <tr>
                        <td>
                            <h4> Hi {username}!</h4>
                            <p>
                                {message}
                            </p>
                        </td>
                    </tr>
                </table>
                <table role="presentation" bgcolor="#EAF0F6" width="100%">
                    <tr align="center">
                        <td style="padding: 10px 10px;">
                            <a href="https://www.facebook.com/SCoRe.Lab.Org/" style="text-decoration: none">
                                <img src="https://cdn-icons-png.flaticon.com/512/20/20837.png" width="20px"/>
                            </a>

                            <a href="https://github.com/scorelab/" style="text-decoration: none">
                                <img src="https://cdn-icons-png.flaticon.com/128/2111/2111432.png" width="20px"/>
                            </a>

                            <a href="https://www.linkedin.com/company/sustainable-computing-research-group-score-/" style="text-decoration: none">
                                <img src="https://cdn-icons-png.flaticon.com/128/2111/2111532.png" width="20px"/>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <p>
                                LabelLab | SCoRe Lab
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        </body>

        </html>
    """
    return template
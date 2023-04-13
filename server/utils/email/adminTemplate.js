const makeAdmin = (text) => `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wellnes Receipt</title>

</head>

<body style="margin:0;background-color:#cccccc;font-family:sans-serif;">
    <center class="wrapper" style="width:100%;table-layout:fixed;background-color:#cccccc;padding-bottom:60px;">
        <table class="main" width="100%"
            style="background-color:#ffffff;margin:0 auto;width:100%;max-width:600px;border-spacing:0;font-family:sans-serif;color:#171a1b;">
            <!-- top border -->
            <tr>
                <td height="8" style="padding:0;background-color: #171a1b;"></td>
            </tr>
            <!-- logo -->
            <tr>
                <td style="padding:  14px 0 4px;">
                    <table width="100%" style="border-spacing:0;">
                        <tr>
                            <td class="two-columns" style="padding:0;text-align:center;font-size:0;">
                                <table class="column"
                                    style="border-spacing:0;width:100%;max-width:300px;display:inline-block;vertical-align:top;text-align:center;font-size:5px;">
                                    <tr>
                                        <td style="padding: 0 62px 10px;"><a href="http://localhost:3000/" target="_blank"  ><img
                                                    src="https://res.cloudinary.com/lamatutorial/image/upload/v1681059958/wellnessLogo/logo_oc1geo_irwan5.png"
                                                    width="120" height="180" title="Wellnes" alt="Wellnes"
                                                    style="border:0;margin-left: 20px;"></a></td>
                                    </tr>
                                </table>
                                <table class="column"
                                    style="border-spacing:0;width:100%;max-width:300px;display:inline-block;vertical-align:top;text-align:center;font-size:5px;padding-top: 40px;">
                                    <tr>
                                        <td style="padding: 0 62px 10px;">
                                          
                                            <p style="font-size: 20px; font-weight: bold;">WELCOME</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <!-- banner -->
            <tr>
                <td style="padding:0;">
                   <img
                            src="https://res.cloudinary.com/lamatutorial/image/upload/v1681057895/wellnessLogo/everything-you-need-know-about-fitness-1440x810_zcbwku.jpg"
                            alt="" width="600" style="border:0;max-width: 100%;">
                </td>
            </tr>
            <!-- three columns -->
            <tr>
                <td style="padding:0;">
                    <table width="100%" style="border-spacing:0;">
                        <!-- mapping items here -->
                        <tr>
                            <td class="three-columns"
                                style="padding:0;text-align:center;font-size:0;padding:15px 0 25px;">
                                <table class="column"
                                    style="border-spacing:0;width:100%;max-width:600px;display:inline-block;vertical-align:top;text-align:center;">
                                    <tr>
                                        <td class="padding" style="padding:0;padding:15px;">
                                            <table class="content"
                                                style="border-spacing:0;font-size:15px;line-height:20px;padding:0 5px;">
                                                <tr>
                                                    <td style="padding:0;">
                                                       ${text}
                                                    </td>
                                                </tr>

                                            </table>
                                        </td>
                                    </tr>
                                </table>


                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td style="padding:0;background-color: #26292b;">
                    <table width="100%" style="border-spacing:0;">
                        <tr>
                            <td style="text-align: center; padding: 45px 20px; color:#ffffff;">
                                <p>Wellnes</p>
                                <p style="padding: 10px;">If you have any problems contact us!</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>

</html>`;
module.exports = makeAdmin;

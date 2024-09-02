import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { Mailclient, sender } from "./mail.config.js";


export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];
    try {
        const response = await Mailclient.send({
            from: sender,
            to: recipient,
            subject: "Email Verification",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })
        console.log('email send successfully', response);

    } catch (error) {
        console.error(error);
        throw new Error("Error sending email");

    }
}

export const sendWelcomeEmail = async (email, username) => {
    const recipient = [{ email }];
    try {
        const response = await Mailclient.send({
            from: sender,
            to: recipient,
            template_uuid: "3387f68e-189b-4fd1-ba99-2b1418db5421",
            template_variables: {
                "name": username,
                "company_info_name": "AuthCompany"
            }
        })
        console.log('welcome email send successfully', response);


    } catch (error) {
        console.error(error);
        throw new Error("Error sending email");

    }
}

export const sendForgetPassword = async (email, resetLink) => {
    const recipient = [{ email }]
    try {
        const response = await Mailclient.send({
            from: sender,
            to: recipient,
            subject: "Reset Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetLink),
            category: "Reset Password",
        })
    } catch (error) {
        throw new Error("Error sending email");
    }
}

export const SendResetPassSuccess = async (email) => {
    const recipient = [{ email }]
    try {
        const response = await Mailclient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Success",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success",
        })
    } catch (error) {
        throw new Error("Error sending email");
    }
}
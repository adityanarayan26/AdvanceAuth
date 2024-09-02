
import { MailtrapClient } from "mailtrap";

const TOKEN ="abee4c49b737a6a4238a5fba32cea39e"

export const Mailclient = new MailtrapClient({
    token: TOKEN,
});

export const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "Mailtrap Test",
};


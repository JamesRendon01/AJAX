import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
FROM_EMAIL = os.getenv("RESEND_FROM", "onboarding@resend.dev")


def send_reset_email(to_email: str, token: str, nombre: str):
    reset_link = f"{FRONTEND_URL}/reset-password/{token}"

    subject = "Recuperacion de contrasena - Club Deportivo"
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px;">
            <h2 style="color: #2563eb;">Recuperacion de contrasena</h2>
            <p>Hola <strong>{nombre}</strong>,</p>
            <p>Recibimos una solicitud para restablecer tu contrasena. Haz clic en el siguiente boton para crear una nueva:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}"
                   style="background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                    Restablecer contrasena
                </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Este enlace expira en 1 hora.</p>
            <p style="color: #6b7280; font-size: 14px;">Si no solicitaste este cambio, ignora este correo.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #9ca3af; font-size: 12px;">Club Deportivo · Todos los derechos reservados</p>
        </div>
    </body>
    </html>
    """

    try:
        params: resend.Emails.SendParams = {
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": html,
        }
        resend.Emails.send(params)
        print(f"Correo enviado a {to_email}")
    except Exception as e:
        print(f"Error al enviar correo a {to_email}: {e}")
        print(f"Link de recuperacion (modo desarrollo): {reset_link}")

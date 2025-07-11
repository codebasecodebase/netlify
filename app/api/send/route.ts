import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    const formData = await request.formData();
    
    // Извлекаем данные из формы
    const organization = formData.get('organization') as string;
    const contactPerson = formData.get('contactPerson') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const file = formData.get('file') as File | null;
    
    // Конфигурация транспорта
    const transporter = nodemailer.createTransport({
        host: 'mail.kompunity.by',
        port: 465,
        secure: true,
        auth: {
            user: 'info@kompunity.by',
            pass: 'bR1qB5gS1d',
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        // 1. ОТПРАВКА ПИСЬМА НА ОСНОВНУЮ ПОЧТУ (АДМИНИСТРАТОРУ)
        const adminHtml = `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Новое сообщение с сайта Kompunity</title>
            <style>
                /* Основные стили */
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f7fa;
                    color: #333;
                    line-height: 1.6;
                }
                
                .email-container {
                    max-width: 650px;
                    margin: 20px auto;
                    background: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                }
                
                .header {
                    background: linear-gradient(135deg, #0700ff 0%, #2d26a6 100%);
                    padding: 40px 20px;
                    text-align: center;
                    color: white;
                }
                
                .logo {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                
                .logo-icon {
                    font-size: 38px;
                }
                
                .title {
                    font-size: 28px;
                    margin: 20px 0 10px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                
                .subtitle {
                    font-size: 18px;
                    opacity: 0.9;
                    max-width: 80%;
                    margin: 0 auto;
                    line-height: 1.5;
                }
                
                .content {
                    padding: 40px 30px;
                    color: #444;
                }
                
                .message-box {
                    background: #f8f9ff;
                    border-left: 4px solid #0700ff;
                    padding: 25px;
                    border-radius: 0 12px 12px 0;
                    margin: 30px 0;
                    font-size: 16px;
                    box-shadow: 0 4px 12px rgba(7, 0, 255, 0.05);
                }
                
                .message-item {
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px dashed #e0e7ff;
                }
                
                .message-item:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: none;
                }
                
                .message-label {
                    font-weight: 600;
                    color: #0700ff;
                    display: block;
                    margin-bottom: 5px;
                }
                
                .message-value {
                    color: #333;
                    font-size: 17px;
                }
                
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(to right, #0700ff, #3a34c9);
                    color: white !important;
                    text-decoration: none;
                    padding: 14px 32px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 17px;
                    margin: 25px 0 15px;
                    text-align: center;
                    box-shadow: 0 4px 15px rgba(7, 0, 255, 0.2);
                    transition: all 0.3s ease;
                }
                
                .cta-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(7, 0, 255, 0.3);
                    background: linear-gradient(to right, #0a08e0, #342fd3);
                }
                
                .footer {
                    text-align: center;
                    padding: 30px 20px;
                    background: #f5f7fa;
                    color: #666;
                    font-size: 14px;
                    border-top: 1px solid #eaeef7;
                }
                
                .contact-info {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    margin: 25px 0;
                    flex-wrap: wrap;
                }
                
                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 16px;
                }
                
                .social-links {
                    display: flex;
                    justify-content: center;
                    gap: 18px;
                    margin: 30px 0;
                }
                
                .social-icon {
                    width: 46px;
                    height: 46px;
                    background: #eef2ff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    font-size: 20px;
                    color: #0700ff;
                }
                
                .social-icon:hover {
                    transform: translateY(-5px);
                    background: #e0e7ff;
                    box-shadow: 0 5px 15px rgba(7, 0, 255, 0.1);
                }
                
                .attachment {
                    background: #f0f4ff;
                    padding: 15px;
                    border-radius: 10px;
                    margin-top: 20px;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .attachment-icon {
                    font-size: 24px;
                    color: #0700ff;
                }
                
                .footer-logo {
                    font-size: 22px;
                    font-weight: 700;
                    color: #0700ff;
                    margin-bottom: 15px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                
                @media (max-width: 600px) {
                    .email-container {
                        margin: 10px;
                        border-radius: 14px;
                    }
                    
                    .header {
                        padding: 30px 15px;
                    }
                    
                    .title {
                        font-size: 24px;
                    }
                    
                    .subtitle {
                        font-size: 16px;
                        max-width: 90%;
                    }
                    
                    .content {
                        padding: 30px 20px;
                    }
                    
                    .contact-info {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .message-box {
                        padding: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <div class="logo">
                        <span class="logo-icon">📬</span>
                        Kompunity
                    </div>
                    <h1 class="title">Новое сообщение с сайта!</h1>
                    <p class="subtitle">Клиент оставил заявку через форму обратной связи</p>
                </div>
                
                <div class="content">
                    <div class="message-box">
                        <div class="message-item">
                            <span class="message-label">Организация</span>
                            <span class="message-value">${organization || 'Не указано'}</span>
                        </div>
                        
                        <div class="message-item">
                            <span class="message-label">Контактное лицо</span>
                            <span class="message-value">${contactPerson}</span>
                        </div>
                        
                        <div class="message-item">
                            <span class="message-label">Email</span>
                            <span class="message-value">
                                <a href="mailto:${email}" style="color: #0700ff; text-decoration: none;">
                                    ${email}
                                </a>
                            </span>
                        </div>
                        
                        <div class="message-item">
                            <span class="message-label">Телефон</span>
                            <span class="message-value">
                                <a href="tel:${phone.replace(/[^\d+]/g, '')}" style="color: #333; text-decoration: none;">
                                    ${phone}
                                </a>
                            </span>
                        </div>
                        
                        <div class="message-item">
                            <span class="message-label">Сообщение</span>
                            <p class="message-value" style="margin-top: 8px; line-height: 1.5;">
                                ${message.replace(/\n/g, '<br>')}
                            </p>
                        </div>
                        
                        ${file ? `
                        <div class="attachment">
                            <span class="attachment-icon">📎</span>
                            <span>Прикреплённый файл: ${file.name}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="mailto:${email}?subject=Ответ на ваше обращение в Kompunity" 
                           class="cta-button">
                            Ответить на сообщение
                        </a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        // Настройки письма для администратора
        const adminMailOptions = {
            from: '"Kompunity Форма" <info@kompunity.by>',
            to: 'novikovrabota433@gmail.com',
            //bcc: ['kompunity.by@gmail.com'],
            subject: `Новое сообщение от ${contactPerson} | ${organization || 'Без организации'}`,
            html: adminHtml,
            attachments: [] as any[],
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high'
            }
        };

        // Добавляем вложение если есть файл
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            adminMailOptions.attachments.push({
                filename: file.name,
                content: buffer,
                contentType: file.type
            });
        }

        // Отправляем письмо администратору
        await transporter.sendMail(adminMailOptions);

        // 2. ОТПРАВКА ПИСЬМА-ПОДТВЕРЖДЕНИЯ КЛИЕНТУ
        const clientHtml = `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Спасибо за обращение в Kompunity</title>
            <style>
                /* Основные стили */
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f7fa;
                    color: #333;
                    line-height: 1.6;
                }
                
                .email-container {
                    max-width: 650px;
                    margin: 20px auto;
                    background: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                }
                
                .header {
                    background: linear-gradient(135deg, #0700ff 0%, #2d26a6 100%);
                    padding: 40px 20px;
                    text-align: center;
                    color: white;
                }
                
                .logo {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                
                .logo-icon {
                    font-size: 38px;
                }
                
                .title {
                    font-size: 28px;
                    margin: 20px 0 10px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                
                .subtitle {
                    font-size: 18px;
                    opacity: 0.9;
                    max-width: 80%;
                    margin: 0 auto;
                    line-height: 1.5;
                }
                
                .content {
                    padding: 40px 30px;
                    color: #444;
                }
                
                .message-box {
                    background: #f8f9ff;
                    border-left: 4px solid #0700ff;
                    padding: 25px;
                    border-radius: 0 12px 12px 0;
                    margin: 30px 0;
                    font-size: 16px;
                    box-shadow: 0 4px 12px rgba(7, 0, 255, 0.05);
                }
                
                .message-item {
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px dashed #e0e7ff;
                }
                
                .message-item:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: none;
                }
                
                .message-label {
                    font-weight: 600;
                    color: #0700ff;
                    display: block;
                    margin-bottom: 5px;
                }
                
                .message-value {
                    color: #333;
                    font-size: 17px;
                }
                
                .contact-info {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin-top: 15px;
                }
                
                .contact-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    font-size: 16px;
                }
                
                .contact-icon {
                    font-size: 24px;
                    min-width: 24px;
                    color: #0700ff;
                    margin-top: 3px;
                }
                
                /* Стили для операторов */
                .operator-cards {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-top: 15px;
                }
                
                .operator-card {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    background: #ffffff;
                    border-radius: 10px;
                    border: 1px solid #e0e7ff;
                    box-shadow: 0 2px 10px rgba(7, 0, 255, 0.05);
                    transition: all 0.3s ease;
                }
                
                .operator-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(7, 0, 255, 0.1);
                }
                
                .operator-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: 700;
                    color: white;
                    flex-shrink: 0;
                }
                
                .operator-a1 {
                    background: linear-gradient(135deg, #e10000, #c40000);
                }
                
                .operator-mts {
                    background: linear-gradient(135deg, #0054a6, #0077cc);
                }
                
                .operator-city {
                    background: linear-gradient(135deg, #007e33, #00a550);
                }
                
                .operator-details {
                    flex-grow: 1;
                }
                
                .operator-name {
                    font-weight: 700;
                    font-size: 17px;
                    margin-bottom: 5px;
                }
                
                .operator-type {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 3px;
                }
                
                .operator-phone {
                    font-size: 18px;
                    font-weight: 600;
                    color: #0700ff;
                }
                
                .footer {
                    text-align: center;
                    padding: 30px 20px;
                    background: #f5f7fa;
                    color: #666;
                    font-size: 14px;
                    border-top: 1px solid #eaeef7;
                }
                
                @media (max-width: 600px) {
                    .email-container {
                        margin: 10px;
                        border-radius: 14px;
                    }
                    
                    .header {
                        padding: 30px 15px;
                    }
                    
                    .title {
                        font-size: 24px;
                    }
                    
                    .subtitle {
                        font-size: 16px;
                        max-width: 90%;
                    }
                    
                    .content {
                        padding: 30px 20px;
                    }
                    
                    .operator-card {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .operator-icon {
                        width: 40px;
                        height: 40px;
                        font-size: 16px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <div class="logo">
                        <span class="logo-icon">✉️</span>
                        Kompunity
                    </div>
                    <h1 class="title">Спасибо за ваше обращение!</h1>
                    <p class="subtitle">Мы получили ваше сообщение и свяжемся с вами в ближайшее время</p>
                </div>
                
                <div class="content">
                    <div class="message-box">
                        <div class="message-item">
                            <span class="message-label">Ваше обращение</span>
                            <p class="message-value">Мы уже обрабатываем ваш запрос и скоро свяжемся с вами для уточнения деталей.</p>
                        </div>
                        
                        <div class="message-item">
                            <span class="message-label">Контактная информация</span>
                            <div class="contact-info">
                                <div class="contact-item">
                                    <div class="contact-icon">📞</div>
                                    <div>
                                        <strong>Телефоны:</strong>
                                        <div class="operator-cards">
                                            <div class="operator-card">
                                                <div class="operator-icon operator-a1">A1</div>
                                                <div class="operator-details">
                                                    <div class="operator-name">A1</div>
                                                    <div class="operator-type">Мобильный (A1)</div>
                                                    <div class="operator-phone">+375 44 703-97-07</div>
                                                </div>
                                            </div>
                                            
                                            <div class="operator-card">
                                                <div class="operator-icon operator-mts">МТС</div>
                                                <div class="operator-details">
                                                    <div class="operator-name">МТС</div>
                                                    <div class="operator-type">Мобильный (МТС)</div>
                                                    <div class="operator-phone">+375 33 636-97-07</div>
                                                </div>
                                            </div>
                                            
                                            <div class="operator-card">
                                                <div class="operator-icon operator-city">Гор</div>
                                                <div class="operator-details">
                                                    <div class="operator-name">Городской</div>
                                                    <div class="operator-type">Городской (Минск)</div>
                                                    <div class="operator-phone">+375 17 307-97-07</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <div class="contact-icon">✉️</div>
                                    <div>
                                        <strong>Email:</strong>
                                        <div><a href="mailto:kompunity.by@gmail.com" style="color: #0700ff; text-decoration: none;">kompunity.by@gmail.com</a></div>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <div class="contact-icon">🏢</div>
                                    <div>
                                        <strong>Адрес:</strong>
                                        <div>г. Минск, ул. Сапёров 5</div>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <div class="contact-icon">🌐</div>
                                    <div>
                                        <strong>Сайт:</strong>
                                        <div><a href="https://kompunity.by" style="color: #0700ff; text-decoration: none;">https://kompunity.by</a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <p style="text-align: center; margin-top: 30px; font-size: 17px;">
                        <strong>С уважением, команда Kompunity</strong>
                    </p>
                </div>
                
                <div class="footer">
                    <p>Это письмо было отправлено автоматически. Пожалуйста, не отвечайте на него.</p>
                    <p>© ${new Date().getFullYear()} Kompunity. Все права защищены.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Настройки письма для клиента
        const clientMailOptions = {
            from: '"Kompunity" <info@kompunity.by>',
            to: email,
            subject: 'Спасибо за обращение в Kompunity',
            html: clientHtml
        };

        // Отправляем письмо клиенту
        await transporter.sendMail(clientMailOptions);

        return NextResponse.json({
            status: 'success',
            message: 'Письма успешно отправлены'
        });
        
    } catch (error: any) {
        console.error('Full error:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message || 'Произошла ошибка при отправке'
        }, { status: 500 });
    }
}
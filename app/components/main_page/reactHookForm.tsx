'use client'
import { useForm, SubmitHandler } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Confetti from 'react-confetti';

import OptimizedAnimatedImageContactFormBackground from "./hookform/contactFormAnimatedI_Img_Background";

gsap.registerPlugin(ScrollTrigger);

type Inputs = {
    organization: string
    contactPerson: string
    email: string
    phone: string
    message: string
    file: FileList | null
}

export default function ReactHookForm() {
    const prevFileName = useRef<string | null>(null);
    const notify = (text: string, options?: any) => toast(text, options);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        resetField,
        formState: { errors },
    } = useForm<Inputs>({ mode: 'onChange' });
    
    const fileList = watch("file");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [dangerMessage, setDangerMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [confetti, setConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const formRef = useRef<HTMLFormElement>(null);
    const viberRef = useRef<HTMLAnchorElement>(null);

    // Эффект для предпросмотра изображений
    useEffect(() => {
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            if (file && file.type.startsWith("image/")) {
                const url = URL.createObjectURL(file);
                setImageUrl(url);
                return () => URL.revokeObjectURL(url);
            } else {
                setImageUrl(null);
            }
        } else {
            setImageUrl(null);
        }
    }, [fileList]);

    // Эффект для очистки сообщений
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 10000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Эффект для определения размера окна (для конфетти)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };

            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Эффект для анимации формы
    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(
                formRef.current,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: formRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }
    }, []);

    // Эффект для анимации Viber
    useEffect(() => {
        if (viberRef.current) {
            gsap.fromTo(
                viberRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: viberRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    onComplete: () => {
                        gsap.to(viberRef.current, {
                            keyframes: [
                                { x: -5, rotate: -10, duration: 0.08 },
                                { x: 5, rotate: 10, duration: 0.08 },
                                { x: -5, rotate: -10, duration: 0.08 },
                                { x: 5, rotate: 10, duration: 0.08 },
                                { x: 0, rotate: 0, duration: 0.08 }
                            ],
                            repeat: 2,
                            ease: "power1.inOut"
                        });
                    }
                }
            );
        }
    }, []);

    // Эффект для вибрации Viber
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        const vibrate = () => {
            if (viberRef.current) {
                gsap.fromTo(
                    viberRef.current,
                    { x: 0, rotate: 0 },
                    {
                        keyframes: [
                            { x: -5, rotate: -10, duration: 0.08 },
                            { x: 5, rotate: 10, duration: 0.08 },
                            { x: -5, rotate: -10, duration: 0.08 },
                            { x: 5, rotate: 10, duration: 0.08 },
                            { x: 0, rotate: 0, duration: 0.08 }
                        ],
                        ease: "power1.inOut"
                    }
                );
            }
        };
        vibrate();
        intervalId = setInterval(vibrate, 2000);
        return () => clearInterval(intervalId);
    }, []);

    // Эффект для конфетти
    useEffect(() => {
        if (showModal) {
            setConfetti(true);
            const timer = setTimeout(() => setConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showModal]);

    // Отправка формы
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setIsSending(true);
        setDangerMessage("");
        setSuccessMessage("");
        
        const formData = new FormData();
        formData.append('organization', data.organization);
        formData.append('contactPerson', data.contactPerson);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('message', data.message);
        
        if (data.file && data.file.length > 0) {
            formData.append('file', data.file[0]);
        }

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            
            if (response.ok) {
                setSuccessMessage("Сообщение успешно отправлено!");
                setShowModal(true);
                reset();
                setFileInputKey(prev => prev + 1);
                setImageUrl(null);
                notify("Форма успешно отправлена!");
            } else {
                setDangerMessage(result.message || 'Что-то пошло не так.');
            }
        } catch (error: any) {
            setDangerMessage('Ошибка сети: ' + error.message);
        } finally {
            setIsSending(false);
        }
    }

    // Проверка на пустую форму
    const formValues = watch();
    const isFormEmpty = !Object.values(formValues).some(value => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim() !== '';
        if (value instanceof FileList) return value.length > 0;
        return false;
    });

    // Форматирование первой буквы в верхний регистр
    const handleInputChange = (onChange: (...event: any[]) => void) => 
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            e.target.value = value.charAt(0).toUpperCase() + value.slice(1);
            onChange(e);
        };

    // Форматирование номера телефона
    const formatPhoneNumber = (value: string) => {
        let digits = value.replace(/\D/g, "");
        digits = digits.slice(0, 12);
        let formatted = "";
        if (digits.length > 0) {
            formatted = "+" + digits.slice(0, 3);
        }
        if (digits.length > 3) {
            formatted += " (" + digits.slice(3, 5);
            if (digits.length >= 5) formatted += ")";
        }
        if (digits.length > 5) {
            formatted += " " + digits.slice(5, Math.min(8, digits.length));
        }
        if (digits.length > 8) {
            formatted += " - " + digits.slice(8, Math.min(10, digits.length));
        }
        if (digits.length > 10) {
            formatted += " - " + digits.slice(10, Math.min(12, digits.length));
        }
        return formatted.trim();
    };

    return (
        <div className="section__responsive-padding relative overflow-hidden" id="hookForm">
            <img 
                src="/gggyrate.svg" 
                alt="background" 
                className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-25" 
                style={{ zIndex: 0 }}
                loading="lazy"
            />
            
            <div className="container w-fulll text-center">
                <h3 className="h2__section-title_responsive-font">ОСТАВЬТЕ СВОЕ СООБЩЕНИЕ</h3>
                <div className="flex gap-[20px]">
                    {/* Модальное окно успешной отправки */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-10">
                                <h3 className="text-xl font-bold mb-4">Сообщение отправлено</h3>
                                <p className="mb-4">Ваше сообщение успешно отправлено!</p>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                                >
                                    Закрыть
                                </button>
                            </div>
                            {confetti && (
                                <Confetti
                                    width={windowSize.width}
                                    height={windowSize.height}
                                    recycle={false}
                                    numberOfPieces={500}
                                    className="fixed inset-0 z-40 pointer-events-none"
                                />
                            )}
                        </div>
                    )}
                    
                    <form 
                        ref={formRef} 
                        onSubmit={handleSubmit(onSubmit)} 
                        style={{ opacity: 0, willChange: 'transform' }} 
                        className="flex flex-wrap space-between contact__form w-[100%] mb-[100px]"
                    >
                        <div className="w-[70%] flex flex-wrap items-start gap-[2%]">
                            <span className="w-[49%] flex flex-wrap items-start">
                                <div className="relative w-[100%]">
                                    <input
                                        placeholder="Организация"
                                        required
                                        type="text"
                                        {...register("organization", {
                                            required: true,
                                        })}
                                        className="w-[100%] p-[20px] rounded-[30px] bg-gray-200 outline-none pr-10"
                                        onChange={handleInputChange(register("organization").onChange)}
                                        value={formValues.organization || ""}
                                    />
                                    {formValues.organization && (
                                        <button
                                            type="button"
                                            className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-400 hover:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
                                            style={{ fontSize: '16px' }}
                                            onClick={() => resetField("organization")}
                                            tabIndex={-1}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                {errors.organization?.type === 'required' && 
                                    <span className="text-red-500 text-sm">Введите организацию</span>}
                            </span>

                            <span className="w-[49%] flex flex-wrap items-start">
                                <div className="relative w-[100%]">
                                    <input
                                        placeholder="Контактное лицо"
                                        required
                                        type="text"
                                        {...register("contactPerson", {
                                            required: true
                                        })}
                                        className="w-[100%] p-[20px] rounded-[30px] bg-gray-200 outline-none pr-10"
                                        onChange={handleInputChange(register("contactPerson").onChange)}
                                        value={formValues.contactPerson || ""}
                                    />
                                    {formValues.contactPerson && (
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-400 hover:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
                                            style={{ fontSize: '16px' }}
                                            onClick={() => resetField("contactPerson")}
                                            tabIndex={-1}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                {errors.contactPerson?.type === 'required' && 
                                    <span className="text-red-500 text-sm">Введите контактное лицо</span>}
                            </span>
                        </div>

                        <div className="w-[30%] flex flex-col justify-center">
                            <h4 className="h4__advantages-section_responsive-font">
                                Адрес
                            </h4>
                            <h5>
                                Сапёров 5, Минск
                            </h5>
                        </div>

                        <div className="w-[70%] flex flex-wrap items-start gap-[2%]">
                            <span className="w-[49%] mt-[20px] flex flex-wrap items-start">
                                <div className="relative w-[100%]">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        {...register("email", {
                                            required: true,
                                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                        })}
                                        className="w-[100%] p-[20px] rounded-[30px] bg-gray-200 outline-none pr-10"
                                        value={formValues.email || ""}
                                        onChange={register("email").onChange}
                                    />
                                    {formValues.email && (
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-400 hover:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
                                            style={{ fontSize: '16px' }}
                                            onClick={() => resetField("email")}
                                            tabIndex={-1}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                {errors.email?.type === 'required' && 
                                    <span className="text-red-500 text-sm">Email обязателен</span>}
                                {errors.email?.type === 'pattern' && 
                                    <span className="text-red-500 text-sm">Введите корректный email</span>}
                            </span>

                            <span className="w-[49%] mt-[20px] flex flex-wrap items-start">
                                <div className="relative w-[100%]">
                                    <input
                                        type="tel"
                                        placeholder="Телефон"
                                        required
                                        title="Заполните телефон"
                                        {...register("phone", {
                                            required: true,
                                            pattern: /^\+375 \(\d{2}\) \d{3} - \d{2} - \d{2}$/
                                        })}
                                        className="w-[100%] p-[20px] rounded-[30px] bg-gray-200 outline-none pr-10"
                                        value={formValues.phone || ""}
                                        onChange={e => {
                                            const formatted = formatPhoneNumber(e.target.value);
                                            e.target.value = formatted;
                                            register("phone").onChange(e);
                                        }}
                                    />
                                    {formValues.phone && (
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-400 hover:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
                                            style={{ fontSize: '16px' }}
                                            onClick={() => resetField("phone")}
                                            tabIndex={-1}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                {errors.phone?.type === 'required' && 
                                    <span className="text-red-500 text-sm">Телефон обязателен</span>}
                                {errors.phone?.type === 'pattern' && 
                                    <span className="text-red-500 text-sm">Введите корректный номер телефона</span>}
                            </span>
                        </div>

                        <div className="w-[30%] mt-[20px] flex flex-col justify-center">
                            <h4 className="h4__advantages-section_responsive-font">
                                Email
                            </h4>
                            <h5>
                                kompunity.by@gmail.com
                            </h5>
                        </div>

                        <span className="w-[70%] mt-[20px] flex flex-wrap items-start">
                            <div className="relative w-[100%]">
                                <textarea
                                    placeholder="Ваше сообщение"
                                    {...register("message", { required: true, minLength: 5 })}
                                    rows={5}
                                    className="w-[100%] p-[20px] rounded-[30px] bg-gray-200 outline-none pr-10"
                                    value={formValues.message || ""}
                                    onChange={register("message").onChange}
                                />
                                {formValues.message && (
                                    <button
                                        type="button"
                                        className="absolute right-4 top-4 bg-gray-400 hover:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
                                        style={{ fontSize: '16px' }}
                                        onClick={() => resetField("message")}
                                        tabIndex={-1}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            {errors.message?.type === 'required' && 
                                <span className="text-red-500 text-sm">Вы не ввели сообщение</span>}
                            {errors.message?.type === 'minLength' && 
                                <span className="text-red-500 text-sm">Минимум 5 символов</span>}
                        </span>

                        <div className="w-[30%] mt-[20px] flex flex-col">
                            <h4 className="h4__advantages-section_responsive-font">
                                Телефоны
                            </h4>
                            <ul>
                                <li>
                                    <a href="tel:+375447039707">А1 44 703 97 07</a>
                                </li>
                                <li>
                                    <a href="tel:+375336369707">МТС 33 636 97 07</a>
                                </li>
                                <li>
                                    <a href="tel:+375173079707">Гор 17 307 97 07</a>
                                </li>
                            </ul>
                            <div className="contacat__icon flex justify-center gap-[5px] mt-[10px]">
                                <a ref={viberRef} href="viber://add?number=375447039707" style={{ willChange: 'transform' }}>
                                    <Image
                                        src={'https://kompunity.by/wp-content/uploads/social_icons/viber_icon.svg'}
                                        alt={`Viber icon`}
                                        width={40}
                                        height={40}
                                        quality={100}
                                        sizes="100vw"
                                        className="object-cover select-none outline-none touch-none"
                                        loading="lazy"
                                    />
                                </a>
                                <a href="https://t.me/kompunity_by">
                                    <Image
                                        src={'https://kompunity.by/wp-content/uploads/social_icons/telegram_icon.svg'}
                                        alt={`Telegram icon`}
                                        width={40}
                                        height={40}
                                        quality={100}
                                        sizes="100vw"
                                        className="object-cover select-none outline-none touch-none"
                                        loading="lazy"
                                    />
                                </a>
                                <a href="https://instagram.com/kompunity.by">
                                    <Image
                                        src={'https://kompunity.by/wp-content/uploads/social_icons/instagram_icon.svg'}
                                        alt={`Instagram icon`}
                                        width={40}
                                        height={40}
                                        quality={100}
                                        sizes="100vw"
                                        className="object-cover select-none outline-none touch-none"
                                        loading="lazy"
                                    />
                                </a>
                            </div>
                        </div>

                        <div className="w-[70%] mt-[20px] flex justify-between">
                            <div>
                                <button 
                                    type="submit" 
                                    className="cursor-pointer p-[20px] rounded-[30px] text-white" 
                                    disabled={isSending} 
                                    style={{ 
                                        background: '#0700ff', 
                                        textTransform: 'uppercase',
                                        opacity: isSending ? 0.7 : 1
                                    }}
                                >
                                    {isSending ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Отправка...
                                        </div>
                                    ) : 'Отправить'}
                                </button>
                                
                                {!isFormEmpty && (
                                    <button 
                                        type="button" 
                                        className="bg-black p-[20px] rounded-[30px] text-white ml-[10px] cursor-pointer"
                                        onClick={() => {
                                            reset();
                                            setFileInputKey(prev => prev + 1);
                                            prevFileName.current = null;
                                            notify("Контактная форма очищена!");
                                        }}
                                    >
                                        Очистить
                                    </button>
                                )}
                            </div>

                            <div className="relative">
                                <div>
                                    <div style={{ alignItems: 'center', gap: '10px' }}>
                                        <input
                                            key={fileInputKey}
                                            id="fileInput"
                                            type="file"
                                            {...register("file", { required: false })}
                                            accept=".gif,.jpeg,.jpg,.png,.odt,.docx,.pdf,.doc,.ppt,.pptx,.ogg,.m4a,.mov,.mp3,.mp4,.mpg,.wav,.avi,.wmv"
                                            onChange={e => {
                                                setFileInputKey(prev => prev + 1);
                                                register("file").onChange(e);
                                                const file = e.target.files && e.target.files[0];
                                                if (file) {
                                                    let message = "Файл выбран: " + file.name;
                                                    if (prevFileName.current && prevFileName.current !== file.name) {
                                                        message = "Файл изменён на: " + file.name;
                                                    }
                                                    prevFileName.current = file.name;
                                                    notify(message, {
                                                        style: {
                                                            background: "linear-gradient(90deg, #3bb3fa 0%, #a259f7 100%)",
                                                            color: "white",
                                                            fontWeight: "bold"
                                                        }
                                                    });
                                                }
                                            }}
                                            className="bg-green-400 p-[20px] rounded-[30px] text-white"
                                            style={{ display: 'none' }}
                                        />
                                        <button
                                            type="button"
                                            className="p-[20px] rounded-[30px] text-white w-[160px] cursor-pointer bg-black"
                                            onClick={() => document.getElementById('fileInput')?.click()}
                                        >
                                            {(fileList && fileList.length > 0)
                                                ? "Изменить файл"
                                                : "Выбрать файл"}
                                        </button>
                                    </div>
                                    {imageUrl ? (
                                        <div className="flex justify-center mt-[10px] absolute" style={{
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                            <div className="relative">
                                                <img 
                                                    src={imageUrl} 
                                                    alt="Предпросмотр" 
                                                    style={{ 
                                                        maxWidth: '150px', 
                                                        maxHeight: '100px', 
                                                        height: '100%', 
                                                        border: '1px solid #ccc', 
                                                        borderRadius: '8px' 
                                                    }} 
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-[4px] top-[4px] bg-gray-400 hover:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
                                                    style={{ fontSize: '16px' }}
                                                    onClick={() => {
                                                        resetField("file")
                                                        prevFileName.current = null;
                                                    }}
                                                    tabIndex={-1}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        fileList && fileList.length > 0 && fileList[0] && !fileList[0].type.startsWith("image/") && (
                                            <div className="relative inline-flex items-center releative justify-between mt-[10px]">
                                                <span className="text-gray-700">{fileList[0].name}</span>
                                                <button
                                                    type="button"
                                                    className="absolute right-[-30px] bg-gray-400 hover:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
                                                    style={{ fontSize: '16px' }}
                                                    onClick={() => resetField("file")}
                                                    tabIndex={-1}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Сообщения об ошибках и успехе */}
                        {dangerMessage && (
                            <div className="w-full mt-4 bg-red-100 text-red-700 p-3 rounded mb-3">
                                {dangerMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className="w-full mt-4 bg-green-100 text-green-700 p-3 rounded mb-3">
                                {successMessage}
                            </div>
                        )}
                    </form>
                    <OptimizedAnimatedImageContactFormBackground />
                </div>
                
            </div>
            
            <ToastContainer 
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}
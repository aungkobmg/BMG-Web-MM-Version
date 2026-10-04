// HTML Document တစ်ခုလုံးကို အပြည့်အစုံ load လုပ်ပြီးမှ အောက်ပါ JavaScript ကုဒ်များ အလုပ်လုပ်စေရန်။
document.addEventListener('DOMContentLoaded', () => {

    // ============== 1. Header Scroll Effect | Scroll လုပ်သည့်အခါ Header နောက်ခံပြောင်းရန် ==============
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            // 50px ထက်ကျော်လျှင် scrolled class ကို toggle လုပ်မည်
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // ============== 2. Mobile Navigation Toggle | Mobile Menu ကို ဖွင့်/ပိတ် လုပ်ဆောင်ရန် ==============
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerMenu && navMenu) {
        const toggleMenu = (isOpen) => {
            const active = isOpen !== undefined ? isOpen : !navMenu.classList.contains('active');
            hamburgerMenu.classList.toggle('active', active);
            navMenu.classList.toggle('active', active);
            document.body.classList.toggle('no-scroll', active);
            hamburgerMenu.setAttribute('aria-expanded', active);
        };

        // Escape နှိပ်လျှင် Menu ပိတ်ပြီး hamburger သို့ focus ပြန်ပို့ရန်
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu(false);
                hamburgerMenu.focus();
            }
        });

        // Hamburger Icon ကို နှိပ်သည့်အခါ
        hamburgerMenu.addEventListener('click', () => toggleMenu());

        // Menu Link တစ်ခုခုကို နှိပ်သည့်အခါ Menu ပြန်ပိတ်ရန်
        navLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
    }

    // ============== 3. Smooth Scrolling | Menu Link များကို နှိပ်လျှင် သက်ဆိုင်ရာ Section သို့ ချောမွေ့စွာသွားရန် ==============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // href="#" သို့မဟုတ် လွတ်နေပါက Error မတက်အောင် တားဆီးရန်
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============== 4. Active Navigation Link on Scroll | ကြည့်ရှုနေသော Section အလိုက် Menu Link ကို Active ဖြစ်စေရန် ==============
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0 && navLinks.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === `#${sectionId}`);
                    });
                }
            });
        }, { threshold: 0.5 }); // Section ၏ 50% ရောက်လျှင် active ပြောင်းမည်

        sections.forEach(section => sectionObserver.observe(section));
    }

    // ============== 5. Scroll-to-Top Button | အပေါ်ပြန်တက်ရန် ခလုတ်ကို ထိန်းချုပ်ရန် ==============
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        }, { passive: true });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============== 6. Dynamic Footer Year | Copyright ခုနှစ်ကို အလိုအလျောက်ပြောင်းလဲရန် ==============
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ============== 7. Contact Form Submission | ဆက်သွယ်ရန် Form ကို ထိန်းချုပ်ရန် ==============
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let formMessage = document.getElementById('formMessage');
            
            // HTML ထဲတွင် #formMessage မရှိပါက အလိုအလျောက် ဖန်တီးပေးမည်
            if (!formMessage) {
                formMessage = document.createElement('div');
                formMessage.id = 'formMessage';
                contactForm.appendChild(formMessage);
            }

            // Backend မရှိသေးသဖြင့် မက်ဆေ့ချ် ပို့ပြီးဟု မပြဘဲ အီးမေးလ် app ဖြင့် ဖွင့်ပေးမည်
            formMessage.setAttribute('role', 'status');
            formMessage.setAttribute('aria-live', 'polite');
            formMessage.style.marginTop = '15px';
            formMessage.style.display = 'block';

            if (!contactForm.checkValidity()) {
                formMessage.style.color = '#b02a37';
                formMessage.textContent = 'လိုအပ်သော အချက်အလက်များကို ဖြည့်သွင်းပါ။';
                contactForm.reportValidity();
                return;
            }

            const data = new FormData(contactForm);
            const body = [
                `အမည်: ${data.get('name')}`,
                `အီးမေးလ်: ${data.get('email')}`,
                `ဖုန်း: ${data.get('phone') || '-'}`,
                '',
                data.get('message')
            ].join('\n');

            formMessage.style.color = 'inherit';
            formMessage.textContent = 'အွန်လိုင်းမှ တိုက်ရိုက်ပေးပို့ခြင်း မရရှိသေးပါ။ သင့်အီးမေးလ် app တွင် contact@bmg.com.mm သို့ draft ဖွင့်ပေးပါမည်။ မဖွင့်ပါက အီးမေးလ်ဖြင့် တိုက်ရိုက်ဆက်သွယ်ပါ။';
            window.location.href = `mailto:contact@bmg.com.mm?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(body)}`;
        });
    }

    // ============== 8. FAQ Accordion | အမေးအဖြေ ကဏ္ဍအတွက် ==============
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (question && answer) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');

                    // အခြား ပွင့်နေသော အဖြေများကို ပိတ်မည်
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            if (otherAnswer) otherAnswer.style.maxHeight = '0px';
                        }
                    });

                    // နှိပ်လိုက်သော အမေးကို ဖွင့်/ပိတ် မည်
                    if (isActive) {
                        item.classList.remove('active');
                        answer.style.maxHeight = '0px';
                    } else {
                        item.classList.add('active');
                        answer.style.maxHeight = `${answer.scrollHeight}px`;
                    }
                });
            }
        });
    }

});
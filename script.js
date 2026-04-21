let currentStep = 1;

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

const modal = document.getElementById('applicationModal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const modalOverlay = document.getElementById('modalOverlay');
const form = document.getElementById('applicationForm');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');
const successPopup = document.getElementById('successPopup');

openModalBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentStep = 1;
    updateFormStep();
}

closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

function updateFormStep() {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });

    document.querySelector('.progress-current').textContent = currentStep;

    prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    nextBtn.style.display = currentStep === 3 ? 'none' : 'block';
    submitBtn.style.display = currentStep === 3 ? 'block' : 'none';
}

nextBtn.addEventListener('click', () => {
    if (currentStep < 3) {
        currentStep++;
        updateFormStep();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateFormStep();
    }
});

const fileInput = document.getElementById('screenshot');
const fileLabel = document.querySelector('.file-text');

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        fileLabel.textContent = e.target.files[0].name;
    } else {
        fileLabel.textContent = 'Выберите файл';
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const age = formData.get('age');
    const families = formData.get('families');
    const servers = formData.get('servers');
    const rollback = formData.get('rollback');
    const screenshot = formData.get('screenshot');
    
    const webhookURL = 'https://discordapp.com/api/webhooks/1496151734027026433/xRcoYToQvdK05VTpzOGCdT1h6VXeVikPoa-NGHxfD2R4POro6vbrPKry8umjkzyRumUY';
    
    const embed = {
        title: '📋 Новая заявка в SENZA',
        color: 0xff1493,
        fields: [
            {
                name: '🎂 Возраст',
                value: age,
                inline: true
            },
            {
                name: '👥 Опыт в семьях',
                value: families || 'Не указано',
                inline: false
            },
            {
                name: '🎮 Стартер паки',
                value: servers || 'Не указано',
                inline: false
            },
            {
                name: '🎯 Откаты',
                value: rollback || 'Не указано',
                inline: false
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'SENZA Applications'
        }
    };
    
    try {
        const payload = new FormData();
        payload.append('payload_json', JSON.stringify({ embeds: [embed] }));
        
        if (screenshot && screenshot.size > 0) {
            payload.append('file', screenshot, 'screenshot.png');
        }
        
        await fetch(webhookURL, {
            method: 'POST',
            body: payload
        });
        
        closeModal();
        successPopup.classList.add('active');
        
        setTimeout(() => {
            successPopup.classList.remove('active');
        }, 3000);
        
        form.reset();
        fileLabel.textContent = 'Выберите файл';
    } catch (error) {
        alert('Ошибка отправки заявки. Попробуйте позже.');
        console.error(error);
    }
});

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

window.addEventListener('load', () => {
    setTimeout(() => {
        animateStats();
    }, 500);
});

let lastX = 0;
let lastY = 0;
let lastTime = Date.now();

document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTime;
    
    if (timeDiff < 8) return;
    
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    
    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    trail.style.left = (e.clientX - 40) + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.transform = `rotate(${angle}deg)`;
    trail.style.transformOrigin = 'center center';
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 1000);
    
    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = currentTime;
});
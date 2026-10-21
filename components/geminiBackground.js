/**
 * Fundo animado com cores suaves estilo Gemini reativo ao toque/mouse
 */
export function initGeminiBackground() {
    if (document.getElementById('geminiCanvas')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'geminiCanvas';
    canvas.className = 'gemini-bg-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    let mouse = {
        x: width / 2,
        y: height / 2,
        targetX: width / 2,
        targetY: height / 2
    };

    const updateMouse = (x, y) => {
        mouse.targetX = x;
        mouse.targetY = y;
    };

    window.addEventListener('mousemove', (e) => updateMouse(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            updateMouse(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    // Orbes com gradientes estilo Gemini (Azul, Roxo, Rosa e Verde Menta)
    const orbs = [
        { x: width * 0.2, y: height * 0.3, radius: 350, color1: 'rgba(99, 102, 241, 0.35)', color2: 'rgba(59, 130, 246, 0.0)', vx: 0.6, vy: 0.4 },
        { x: width * 0.8, y: height * 0.7, radius: 400, color1: 'rgba(236, 72, 153, 0.25)', color2: 'rgba(168, 85, 247, 0.0)', vx: -0.5, vy: -0.4 },
        { x: width * 0.5, y: height * 0.5, radius: 320, color1: 'rgba(56, 189, 248, 0.3)', color2: 'rgba(16, 185, 129, 0.0)', vx: 0.4, vy: -0.5 }
    ];

    function animate() {
        ctx.clearRect(0, 0, width, height);

        mouse.x += (mouse.targetX - mouse.x) * 0.04;
        mouse.y += (mouse.targetY - mouse.y) * 0.04;

        orbs.forEach((orb) => {
            orb.x += orb.vx;
            orb.y += orb.vy;

            if (orb.x < -150 || orb.x > width + 150) orb.vx *= -1;
            if (orb.y < -150 || orb.y > height + 150) orb.vy *= -1;

            // Atração/Repulsão suave em direção ao toque do usuário
            const dx = mouse.x - orb.x;
            const dy = mouse.y - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 500) {
                orb.x += dx * 0.008;
                orb.y += dy * 0.008;
            }

            const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
            gradient.addColorStop(0, orb.color1);
            gradient.addColorStop(1, orb.color2);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

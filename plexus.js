/* Plexus effect : particules reliées entre elles, réactives à la souris. */
(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'plexus';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LINK = 140, MOUSE = 180, RGB = '0,113,227';
    const mouse = { x: null, y: null };
    const pts = [];
    let W, H;

    function resize() {
        const d = window.devicePixelRatio || 1;
        W = innerWidth; H = innerHeight;
        canvas.width = W * d; canvas.height = H * d;
        ctx.setTransform(d, 0, 0, d, 0, 0);
        const n = Math.min(110, Math.floor(W * H / 14000));
        while (pts.length < n) pts.push({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5
        });
        pts.length = n;
    }

    function frame() {
        ctx.clearRect(0, 0, W, H);
        for (const p of pts) {
            if (!reduce) {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${RGB},0.55)`;
            ctx.fill();
        }
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) link(pts[i], pts[j], LINK, 0.22);
            if (mouse.x !== null) link(pts[i], mouse, MOUSE, 0.45);
        }
        if (!reduce) requestAnimationFrame(frame);
    }

    function link(a, b, max, alpha) {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > max) return;
        ctx.strokeStyle = `rgba(${RGB},${alpha * (1 - dist / max)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    }

    addEventListener('resize', resize);
    addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    addEventListener('mouseout', () => { mouse.x = mouse.y = null; });
    resize();
    frame();

    // Masque proprement les images (logos, photo) qui n'existent pas encore
    addEventListener('load', () => {
        document.querySelectorAll('.org-logo, .hero-avatar img').forEach(img => {
            if (!img.naturalWidth) img.style.display = 'none';
        });
    });
})();

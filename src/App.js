import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #050a18; color: #e8eaf6; font-family: 'DM Sans', sans-serif; overflow-x: hidden; cursor: none; }

  .cursor { width: 14px; height: 14px; background: #00e676; border-radius: 50%; position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999; transform: translate(-50%,-50%); mix-blend-mode: difference; transition: background 0.2s; }
  .cursor-ring { width: 40px; height: 40px; border: 1.5px solid #b388ff; border-radius: 50%; position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9998; transform: translate(-50%,-50%); transition: left 0.15s ease, top 0.15s ease; }

  #stars-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .grid-overlay { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(124,77,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,77,255,0.04) 1px, transparent 1px); background-size: 60px 60px; }
  .orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; opacity: 0.15; }
  .orb1 { width: 600px; height: 600px; background: #7c4dff; top: -200px; left: -200px; }
  .orb2 { width: 500px; height: 500px; background: #00e676; bottom: -100px; right: -100px; }

  nav { display: flex; align-items: center; justify-content: space-between; padding: 22px 6vw; border-bottom: 1px solid rgba(124,77,255,0.25); background: rgba(5,10,24,0.85); backdrop-filter: blur(18px); position: sticky; top: 0; z-index: 100; }
  .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem; letter-spacing: -0.5px; }
  .logo span { color: #00e676; }
  .nav-links { display: flex; gap: 36px; list-style: none; }
  .nav-links a { color: #8899bb; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
  .nav-links a:hover { color: #00e676; }
  .nav-cta { background: linear-gradient(135deg, #00e676, #7c4dff); color: #000; font-weight: 700; font-size: 0.85rem; padding: 10px 24px; border-radius: 50px; text-decoration: none; letter-spacing: 0.5px; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 0 20px rgba(0,230,118,0.3); cursor: pointer; border: none; }
  .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(0,230,118,0.5); }

  .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 6vw 60px; perspective: 1000px; position: relative; z-index: 2; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(124,77,255,0.12); border: 1px solid rgba(124,77,255,0.25); border-radius: 50px; padding: 8px 20px; font-size: 0.8rem; color: #b388ff; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 32px; animation: fadeUp 0.8s ease both; }
  .dot-green { color: #00e676; font-size: 0.6rem; }
  .hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(3rem, 8vw, 7rem); font-weight: 800; line-height: 0.95; letter-spacing: -2px; animation: fadeUp 0.9s 0.1s ease both; }
  .line2 { display: block; color: #00e676; }
  .line3 { display: block; background: linear-gradient(90deg, #b388ff, #00e676); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero-sub { max-width: 560px; color: #8899bb; font-size: 1.05rem; line-height: 1.7; margin-top: 28px; animation: fadeUp 1s 0.2s ease both; }
  .hero-btns { display: flex; gap: 16px; margin-top: 40px; flex-wrap: wrap; justify-content: center; animation: fadeUp 1s 0.3s ease both; }
  .btn-primary { background: #00e676; color: #000; font-weight: 700; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-size: 0.95rem; box-shadow: 0 0 40px rgba(0,230,118,0.4); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; border: none; }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 0 60px rgba(0,230,118,0.6); }
  .btn-outline { border: 1px solid rgba(124,77,255,0.25); color: #b388ff; font-weight: 600; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-size: 0.95rem; transition: background 0.2s, border-color 0.2s; cursor: pointer; background: transparent; }
  .btn-outline:hover { background: rgba(124,77,255,0.1); border-color: #b388ff; }

  .hero-3d { margin-top: 70px; display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; animation: fadeUp 1s 0.5s ease both; }
  .stat-chip { background: #0d1a30; border: 1px solid rgba(124,77,255,0.25); border-radius: 16px; padding: 20px 28px; text-align: center; transition: transform 0.3s ease, box-shadow 0.3s; box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05); }
  .stat-chip:hover { transform: rotateY(-10deg) rotateX(8deg) translateZ(20px); box-shadow: 12px 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,230,118,0.15); }
  .stat-num { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #00e676; }
  .stat-label { font-size: 0.78rem; color: #8899bb; margin-top: 4px; }

  section { position: relative; z-index: 2; }
  .section-title { text-align: center; margin-bottom: 60px; }
  .section-title h2 { font-family: 'Syne', sans-serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; letter-spacing: -1px; }
  .section-title h2 span { color: #00e676; }
  .section-title p { color: #8899bb; margin-top: 12px; font-size: 1rem; }
  .pill-tag { display: inline-block; background: rgba(0,230,118,0.08); border: 1px solid rgba(0,230,118,0.2); color: #00e676; font-size: 0.75rem; padding: 6px 16px; border-radius: 50px; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 16px; }

  .services { padding: 100px 6vw; }
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
  .service-card { background: #0d1a30; border: 1px solid rgba(124,77,255,0.25); border-radius: 20px; padding: 36px 32px; transition: transform 0.3s ease, box-shadow 0.3s, border-color 0.3s; box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04); position: relative; overflow: hidden; }
  .service-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #00e676, #7c4dff); transform: scaleX(0); transition: transform 0.3s; transform-origin: left; }
  .service-card:hover { border-color: rgba(124,77,255,0.5); box-shadow: 10px 14px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,230,118,0.08); }
  .service-card:hover::before { transform: scaleX(1); }
  .svc-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 22px; }
  .svc-icon.green { background: rgba(0,230,118,0.12); }
  .svc-icon.purple { background: rgba(124,77,255,0.12); }
  .service-card h3 { font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 700; margin-bottom: 10px; }
  .service-card p { color: #8899bb; font-size: 0.88rem; line-height: 1.65; }

  .pricing { padding: 100px 6vw; }
  .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px; max-width: 820px; margin: 0 auto; }
  .price-card { background: #0d1a30; border: 1px solid rgba(124,77,255,0.25); border-radius: 24px; padding: 40px 36px; transition: transform 0.3s ease, box-shadow 0.3s; box-shadow: 0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04); position: relative; }
  .price-card.featured { border-color: rgba(0,230,118,0.35); box-shadow: 0 12px 50px rgba(0,0,0,0.5), 0 0 40px rgba(0,230,118,0.12); }
  .price-card:hover { transform: translateY(-6px) rotateX(3deg); }
  .price-badge { display: inline-block; background: linear-gradient(90deg, #00e676, #7c4dff); color: #000; font-size: 0.7rem; font-weight: 700; padding: 5px 14px; border-radius: 50px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; }
  .price-card h3 { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; margin-bottom: 6px; }
  .price-sub { color: #8899bb; font-size: 0.78rem; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; }
  .price-amount { font-family: 'Syne', sans-serif; font-size: 3.2rem; font-weight: 800; line-height: 1; margin-bottom: 6px; }
  .price-amount.green { color: #00e676; }
  .price-amount.purple { color: #b388ff; }
  .price-for { display: inline-block; border: 1px solid currentColor; border-radius: 6px; padding: 4px 12px; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 28px; }
  .price-for.green { color: #00e676; }
  .price-for.purple { color: #b388ff; }
  .feat-list { list-style: none; margin-bottom: 32px; }
  .feat-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.88rem; padding: 7px 0; color: #8899bb; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .feat-list li:last-child { border-bottom: none; }
  .ck { color: #00e676; font-size: 0.8rem; margin-top: 2px; flex-shrink: 0; }
  .price-cta { display: block; text-align: center; padding: 14px; border-radius: 50px; font-weight: 700; font-size: 0.9rem; text-decoration: none; transition: all 0.2s; cursor: pointer; border: none; width: 100%; }
  .price-cta.green { background: #00e676; color: #000; box-shadow: 0 0 30px rgba(0,230,118,0.3); }
  .price-cta.green:hover { box-shadow: 0 0 50px rgba(0,230,118,0.6); transform: translateY(-2px); }
  .price-cta.purple { background: linear-gradient(135deg, #7c4dff, #b388ff); color: #fff; box-shadow: 0 0 30px rgba(124,77,255,0.3); }
  .price-cta.purple:hover { box-shadow: 0 0 50px rgba(124,77,255,0.5); transform: translateY(-2px); }
  .domain-box { display: flex; align-items: center; gap: 12px; border-radius: 12px; padding: 14px 16px; margin-top: 20px; }
  .domain-box.green-box { background: rgba(0,230,118,0.06); border: 1px solid rgba(0,230,118,0.15); }
  .domain-box.purple-box { background: rgba(124,77,255,0.06); border: 1px solid rgba(124,77,255,0.15); }
  .domain-box .di { font-size: 1.1rem; }
  .domain-box .dt { font-size: 0.8rem; font-weight: 700; }
  .domain-box .dt.g { color: #00e676; }
  .domain-box .dt.p { color: #b388ff; }
  .domain-box .ds { font-size: 0.72rem; color: #8899bb; }

  .info-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1px; background: rgba(124,77,255,0.25); margin: 0 6vw 80px; border: 1px solid rgba(124,77,255,0.25); border-radius: 20px; overflow: hidden; position: relative; z-index: 2; }
  .info-block { background: #0d1a30; padding: 32px 28px; }
  .ib-title { font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 14px; }
  .ib-title.green { color: #00e676; }
  .ib-title.purple { color: #b388ff; }
  .ib-title.blue { color: #64b5f6; }
  .info-block p { color: #8899bb; font-size: 0.84rem; line-height: 1.65; }
  .info-block ul { list-style: none; }
  .info-block ul li { color: #8899bb; font-size: 0.84rem; padding: 4px 0; display: flex; align-items: center; gap: 8px; }
  .info-block ul li::before { content: '✓'; color: #00e676; font-size: 0.75rem; }

  .skills-sec { padding: 80px 6vw; }
  .skills-grid { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
  .skill-tag { background: #0d1a30; border: 1px solid rgba(124,77,255,0.25); border-radius: 50px; padding: 10px 22px; font-size: 0.85rem; color: #e8eaf6; transition: all 0.2s; cursor: default; }
  .skill-tag:hover { border-color: #00e676; color: #00e676; transform: translateY(-2px); }

  .contact-sec { padding: 80px 6vw 60px; position: relative; z-index: 2; }
  .contact-wrap { max-width: 680px; margin: 0 auto; background: #0d1a30; border: 1px solid rgba(124,77,255,0.25); border-radius: 28px; padding: 56px 48px; box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 60px rgba(0,230,118,0.05); }
  .contact-wrap h2 { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 10px; text-align: center; }
  .contact-wrap > p { color: #8899bb; margin-bottom: 36px; line-height: 1.7; text-align: center; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .form-field.full { grid-column: 1 / -1; }
  .form-field label { font-size: 0.78rem; font-weight: 600; color: #b388ff; letter-spacing: 0.8px; text-transform: uppercase; }
  .form-field input, .form-field select, .form-field textarea {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(124,77,255,0.25); border-radius: 12px;
    padding: 13px 16px; color: #e8eaf6; font-family: 'DM Sans', sans-serif; font-size: 0.92rem;
    transition: border-color 0.2s, box-shadow 0.2s; outline: none;
  }
  .form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color: #00e676; box-shadow: 0 0 0 3px rgba(0,230,118,0.1); }
  .form-field select option { background: #0d1a30; }
  .form-field textarea { resize: vertical; min-height: 110px; }
  .form-submit { width: 100%; margin-top: 8px; background: linear-gradient(135deg, #00e676, #7c4dff); color: #000; font-weight: 700; font-size: 1rem; padding: 16px; border-radius: 50px; border: none; cursor: pointer; font-family: 'Syne', sans-serif; letter-spacing: 0.5px; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 0 30px rgba(0,230,118,0.3); }
  .form-submit:hover { transform: translateY(-2px); box-shadow: 0 0 50px rgba(0,230,118,0.5); }
  .form-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .form-success { text-align: center; padding: 40px 0; }
  .form-success .big { font-size: 3rem; margin-bottom: 16px; }
  .form-success h3 { font-family: 'Syne', sans-serif; font-size: 1.5rem; color: #00e676; margin-bottom: 8px; }
  .form-success p { color: #8899bb; }
  .contact-links { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-top: 28px; }
  .contact-link { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(124,77,255,0.25); border-radius: 50px; padding: 12px 22px; text-decoration: none; color: #e8eaf6; font-size: 0.85rem; transition: all 0.2s; }
  .contact-link:hover { border-color: #00e676; color: #00e676; transform: translateY(-2px); }

  .whatsapp-fab { position: fixed; bottom: 32px; right: 32px; z-index: 500; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
  .wa-tooltip { background: #0d1a30; border: 1px solid rgba(0,230,118,0.3); border-radius: 12px; padding: 10px 16px; font-size: 0.82rem; color: #e8eaf6; white-space: nowrap; box-shadow: 0 4px 20px rgba(0,0,0,0.4); animation: fadeUp 0.3s ease; }
  .wa-btn { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #25d366, #128c7e); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 20px rgba(37,211,102,0.4), 0 0 0 0 rgba(37,211,102,0.4); animation: waPulse 2.5s infinite; text-decoration: none; transition: transform 0.2s; border: none; }
  .wa-btn:hover { transform: scale(1.1); }
  .wa-btn svg { width: 30px; height: 30px; fill: white; }
  @keyframes waPulse { 0%,100% { box-shadow: 0 4px 20px rgba(37,211,102,0.4), 0 0 0 0 rgba(37,211,102,0.3); } 50% { box-shadow: 0 4px 20px rgba(37,211,102,0.4), 0 0 0 14px rgba(37,211,102,0); } }

  footer { border-top: 1px solid rgba(124,77,255,0.25); padding: 28px 6vw; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; position: relative; z-index: 2; }
  .footer-links { display: flex; gap: 28px; list-style: none; }
  .footer-links a { color: #8899bb; text-decoration: none; font-size: 0.82rem; transition: color 0.2s; }
  .footer-links a:hover { color: #00e676; }
  .footer-copy { color: #8899bb; font-size: 0.78rem; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 640px) { .nav-links { display: none; } .form-grid { grid-template-columns: 1fr; } .contact-wrap { padding: 32px 20px; } }
`;

// ── Stars canvas
function Stars() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let stars = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 160; i++) stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.3, o: Math.random() * 0.7 + 0.2, speed: Math.random() * 0.0002 + 0.00005 });
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => { ctx.beginPath(); ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(200,220,255,${s.o})`; ctx.fill(); s.y += s.speed; if (s.y > 1) { s.y = 0; s.x = Math.random(); } });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas id="stars-canvas" ref={canvasRef} />;
}

// ── Cursor
function Cursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const move = e => { mx = e.clientX; my = e.clientY; if (cursorRef.current) { cursorRef.current.style.left = mx + "px"; cursorRef.current.style.top = my + "px"; } };
    document.addEventListener("mousemove", move);
    let raf;
    const anim = () => { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; if (ringRef.current) { ringRef.current.style.left = rx + "px"; ringRef.current.style.top = ry + "px"; } raf = requestAnimationFrame(anim); };
    anim();
    return () => { document.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return (<><div className="cursor" ref={cursorRef} /><div className="cursor-ring" ref={ringRef} /></>);
}

// ── 3D tilt hook — ref is stable, so it's safe to pass as a dep
function use3DTilt(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const over = e => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5; el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateZ(18px)`; };
    const out = () => { el.style.transform = ""; };
    el.addEventListener("mousemove", over); el.addEventListener("mouseleave", out);
    return () => { el.removeEventListener("mousemove", over); el.removeEventListener("mouseleave", out); };
  }, [ref]); // ✅ fixed: ref added as dependency
}

function TiltCard({ className, children }) {
  const ref = useRef(null); use3DTilt(ref);
  return <div className={className} ref={ref}>{children}</div>;
}

// ── WhatsApp FAB
function WhatsAppFAB() {
  const [show, setShow] = useState(false);
  return (
    <div className="whatsapp-fab">
      {show && <div className="wa-tooltip">💬 Chat with Rojar on WhatsApp</div>}
      <a
        className="wa-btn"
        href="https://wa.me/918925617404?text=Hi%20Rojar%2C%20I%27m%20interested%20in%20your%20web%20development%20services!"
        target="_blank" rel="noreferrer"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}

// ── Contact Form
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = e => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1400);
  };

  if (sent) return (
    <div className="form-success">
      <div className="big">🎉</div>
      <h3>Message Sent!</h3>
      <p>Thanks {form.name}! I'll get back to you within 24 hours.</p>
      <div className="contact-links" style={{marginTop: 24}}>
        <a href="https://wa.me/918925617404" target="_blank" rel="noreferrer" className="contact-link">💬 Continue on WhatsApp</a>
      </div>
    </div>
  );

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="form-field">
          <label>Your Name</label>
          <input name="name" value={form.name} onChange={handle} placeholder="John Doe" required />
        </div>
        <div className="form-field">
          <label>Email Address</label>
          <input name="email" type="email" value={form.email} onChange={handle} placeholder="john@example.com" required />
        </div>
        <div className="form-field">
          <label>Phone Number</label>
          <input name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" />
        </div>
        <div className="form-field">
          <label>Service Needed</label>
          <select name="service" value={form.service} onChange={handle} required>
            <option value="">Select a Package</option>
            <option value="basic">Basic Website – ₹5999</option>
            <option value="ecommerce">E-Commerce Website – ₹11999</option>
            <option value="custom">Custom Project</option>
          </select>
        </div>
        <div className="form-field full">
          <label>Tell me about your project</label>
          <textarea name="message" value={form.message} onChange={handle} placeholder="Describe your business, what kind of website you need, any specific features..." required />
        </div>
      </div>
      <button type="submit" className="form-submit" disabled={sending}>
        {sending ? "Sending…" : "🚀 Send Message"}
      </button>
    </form>
  );
}

// ── MAIN APP
export default function RojarLanding() {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{styles}</style>
      <Stars />
      <div className="grid-overlay" />
      <div className="orb orb1" />
      <div className="orb orb2" />
      <Cursor />

      {/* NAV */}
      <nav>
        <div className="logo">Rojar <span>Benny</span></div>
        <ul className="nav-links">
          {["services","pricing","skills","contact"].map(s => (
            <li key={s}><a href={`#${s}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</a></li>
          ))}
        </ul>
        <button className="nav-cta" onClick={() => scrollTo("contact")}>Hire Me</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge"><span className="dot-green">●</span> Available for Projects</div>
        <h1>
          Professional
          <span className="line2">Websites.</span>
          <span className="line3">One Time Payment.</span>
        </h1>
        <p className="hero-sub">Frontend Developer building stunning, responsive websites for businesses — no subscriptions, no hidden charges. Simple. Affordable. Professional.</p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => scrollTo("pricing")}>View Packages</button>
          <button className="btn-outline" onClick={() => scrollTo("services")}>What I Build →</button>
        </div>
        <div className="hero-3d">
          {[["2+","Years Experience"],["10+","Projects Delivered"],["100%","Custom Design"],["0","Hidden Charges"]].map(([n,l]) => (
            <TiltCard key={l} className="stat-chip">
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <div className="section-title">
          <div className="pill-tag">What I Build</div>
          <h2>Services <span>Offered</span></h2>
          <p>Everything you need for a powerful online presence</p>
        </div>
        <div className="cards-grid">
          {[
            { icon: "🖥️", cls: "green", title: "Basic Business Website", desc: "1–3 page responsive website with mobile-first design, contact form, WhatsApp button, and basic SEO setup. Perfect for small businesses going online." },
            { icon: "🛒", cls: "purple", title: "E-Commerce Website", desc: "Complete online store with up to 50 products, shopping cart, payment gateway integration, order management, and speed optimization." },
            { icon: "📱", cls: "green", title: "Mobile Responsive Design", desc: "Every website is built mobile-first and tested across all screen sizes — phones, tablets, and desktops for a seamless experience everywhere." },
            { icon: "🔒", cls: "purple", title: "SSL & Security Setup", desc: "Free SSL certificate (HTTPS), secure hosting configuration, and performance optimization included with every project at no extra cost." },
            { icon: "🌐", cls: "green", title: "Domain & Hosting", desc: "1-year .com domain registration and reliable hosting included in all packages. Everything under one roof — launch ready from day one." },
            { icon: "⚡", cls: "purple", title: "SEO & Performance", desc: "Basic SEO setup, fast loading speed optimization, and best practices implementation so your site ranks and loads lightning fast." },
          ].map(s => (
            <TiltCard key={s.title} className="service-card">
              <div className={`svc-icon ${s.cls}`}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="section-title">
          <div className="pill-tag">Pricing</div>
          <h2>Simple, <span>Transparent</span> Packages</h2>
          <p>Professional Websites. One Time Payment. No Hidden Charges.</p>
        </div>
        <div className="pricing-grid">
          {/* Basic */}
          <TiltCard className="price-card featured">
            <div className="price-badge">Most Popular</div>
            <h3>Basic Website</h3>
            <div className="price-sub">One Time Payment</div>
            <div className="price-amount green">₹5999/-</div>
            <div className="price-for green">Perfect for Small Businesses</div>
            <ul className="feat-list">
              {["1–3 Pages Website","Additional Pages: ₹500/page","Mobile Responsive Design","Contact Form (Lead on Email)","WhatsApp Button","Basic SEO Setup","1 Year Domain & Hosting","Free SSL Certificate (HTTPS)","Fast Loading & Optimized","1 Week Free Support"].map(f => (
                <li key={f}><span className="ck">✓</span>{f}</li>
              ))}
            </ul>
            <button className="price-cta green" onClick={() => scrollTo("contact")}>Get Started →</button>
            <div className="domain-box green-box"><span className="di">🌐</span><div><div className="dt g">Domain Included</div><div className="ds">1 Year .com Domain</div></div></div>
          </TiltCard>
          {/* E-commerce */}
          <TiltCard className="price-card">
            <h3>E-Commerce Website</h3>
            <div className="price-sub">One Time Payment</div>
            <div className="price-amount purple">₹11999/-</div>
            <div className="price-for purple">Complete Online Store Solution</div>
            <ul className="feat-list">
              {["Complete E-commerce Website","Up to 50 Products","Product Listing","Shopping Cart & Checkout","Payment Gateway Integration","Order Management","Mobile Responsive Design","Basic SEO + Speed Optimization","1 Year Domain & Hosting","Free SSL Certificate (HTTPS)","1 Week Free Support"].map(f => (
                <li key={f}><span className="ck">✓</span>{f}</li>
              ))}
            </ul>
            <button className="price-cta purple" onClick={() => scrollTo("contact")}>Get Started →</button>
            <div className="domain-box purple-box"><span className="di">🌐</span><div><div className="dt p">Domain Included</div><div className="ds">1 Year .com Domain</div></div></div>
          </TiltCard>
        </div>
      </section>

      {/* INFO STRIP */}
      <div className="info-strip">
        <div className="info-block">
          <div className="ib-title green">✏️ About Changes</div>
          <p>After delivery, any updates or changes will be done on request and charged based on the work required.</p>
        </div>
        <div className="info-block">
          <div className="ib-title purple">🛡️ Why Choose Me?</div>
          <ul>{["Custom Design for Your Business","No Templates, 100% Tailored","One Time Payment, No Subscription","Support When You Need"].map(i=><li key={i}>{i}</li>)}</ul>
        </div>
        <div className="info-block">
          <div className="ib-title blue">🔒 Included in All Plans</div>
          <ul>{["1 Year Domain & Hosting","Free SSL Certificate (HTTPS)","Mobile Friendly","Basic SEO Setup","1 Week Free Support"].map(i=><li key={i}>{i}</li>)}</ul>
        </div>
      </div>

      {/* SKILLS */}
      <section className="skills-sec" id="skills">
        <div className="section-title">
          <div className="pill-tag">Tech Stack</div>
          <h2>Built With <span>Modern</span> Technologies</h2>
        </div>
        <div className="skills-grid">
          {["⚛️ React.js","🟡 JavaScript","🔵 HTML5","🎨 CSS3","📐 Bootstrap","☕ Java","🍃 Spring Boot","🗄️ MySQL","🔧 VS Code","📮 Postman"].map(s => (
            <div key={s} className="skill-tag">{s}</div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-sec" id="contact">
        <div className="section-title">
          <div className="pill-tag">Get In Touch</div>
          <h2>Ready to <span>Launch?</span></h2>
        </div>
        <div className="contact-wrap">
          <h2 style={{color:"#00e676"}}>Let's Build Together</h2>
          <p>Fill out the form below and I'll get back to you within 24 hours with a plan for your website.</p>
          <ContactForm />
          <div className="contact-links">
            <a href="tel:+918925617404" className="contact-link">📞 +91 89256 17404</a>
            <a href="mailto:k.rojarbenny@gmail.com" className="contact-link">✉️ k.rojarbenny@gmail.com</a>
            <a href="https://linkedin.com/in/rojar-benny-k-962307248" target="_blank" rel="noreferrer" className="contact-link">💼 LinkedIn</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="logo">Rojar <span>Benny</span></div>
        <ul className="footer-links">
          {["services","pricing","contact"].map(s=><li key={s}><a href={`#${s}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</a></li>)}
        </ul>
        <div className="footer-copy">🔒 Secure &nbsp;|&nbsp; ⚡ Fast Delivery &nbsp;|&nbsp; 🎧 Support When You Need</div>
      </footer>

      {/* Floating WhatsApp */}
      <WhatsAppFAB />
    </>
  );
}
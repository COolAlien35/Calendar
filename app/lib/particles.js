export function makeParticle(type, theme, canvasWidth, canvasHeight) {
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size: Math.random() * 3 + 0.8,
    speed: Math.random() * 0.6 + 0.15,
    opacity: Math.random() * 0.5 + 0.05,
    drift: (Math.random() - 0.5) * 0.4,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.015 + 0.003,
    type,
    color: theme.accent,
    baseX: 0,
    baseY: 0
  };
}

export function drawParticle(ctx, p) {
  ctx.save();
  ctx.globalAlpha = p.opacity;

  switch (p.type) {
    case 'snow': case 'pollen':
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'stars': case 'shimmer':
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fill();
      break;
    case 'rain': case 'storm':
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.type === 'storm' ? 0.6 : 0.8;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      const len = p.type === 'storm' ? 10 : 6;
      ctx.lineTo(p.x + p.drift * 5, p.y + p.size * len);
      ctx.stroke();
      break;
    case 'leaves':
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 2.5, p.size, p.wobble, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'hearts':
      ctx.fillStyle = p.color;
      const s = p.size * 0.7;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + s);
      ctx.bezierCurveTo(p.x - s*2, p.y - s, p.x - s*4, p.y + s, p.x, p.y + s*3);
      ctx.bezierCurveTo(p.x + s*4, p.y + s, p.x + s*2, p.y - s, p.x, p.y + s);
      ctx.fill();
      break;
    case 'bloom':
      ctx.fillStyle = p.color;
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + p.wobble;
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(angle) * p.size * 1.2, p.y + Math.sin(angle) * p.size * 1.2, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case 'ocean':
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI);
      ctx.stroke();
      break;
    case 'heat':
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      for (let i = 0; i < 8; i++) {
        ctx.lineTo(p.x + Math.sin(i * 0.8 + p.wobble) * p.size * 2, p.y - i * 3);
      }
      ctx.stroke();
      break;
    case 'mist':
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 10);
      g.addColorStop(0, p.color + '33');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 10, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  ctx.restore();
}

export function updateParticle(p, mouseX, mouseY, canvasWidth, canvasHeight) {
  p.wobble += p.wobbleSpeed;

  // cursor influence
  const cx = mouseX * canvasWidth;
  const cy = mouseY * canvasHeight;
  const dx = p.x - cx;
  const dy = p.y - cy;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist < 200 && dist > 0) {
    const force = (200 - dist) / 200 * 0.3;
    p.x += (dx / dist) * force;
    p.y += (dy / dist) * force;
  }

  switch (p.type) {
    case 'rain': case 'storm':
      p.y += p.speed * (p.type === 'storm' ? 4 : 2.5);
      p.x += p.drift * 2;
      break;
    case 'ocean':
      p.x += p.speed * 0.4;
      p.y += Math.sin(p.wobble) * 0.3;
      break;
    case 'mist':
      p.x += Math.sin(p.wobble * 0.3) * 0.4;
      p.y -= p.speed * 0.08;
      break;
    case 'heat':
      p.y -= p.speed * 0.4;
      p.x += Math.sin(p.wobble) * 0.4;
      break;
    case 'leaves':
      p.y += p.speed * 0.7;
      p.x += Math.sin(p.wobble) * 1;
      break;
    case 'shimmer':
      p.opacity = 0.05 + Math.abs(Math.sin(p.wobble)) * 0.45;
      p.x += Math.sin(p.wobble * 0.3) * 0.2;
      break;
    case 'stars':
      p.opacity = 0.05 + Math.abs(Math.sin(p.wobble * 0.5)) * 0.5;
      break;
    default:
      p.y += p.speed;
      p.x += Math.sin(p.wobble) * p.drift;
  }

  if (p.y > canvasHeight + 20) { p.y = -10; p.x = Math.random() * canvasWidth; }
  if (p.x > canvasWidth + 20) p.x = -10;
  if (p.x < -20) p.x = canvasWidth + 10;
  if (p.y < -30) { p.y = canvasHeight + 10; p.x = Math.random() * canvasWidth; }
}

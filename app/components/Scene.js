'use client';

import { useEffect, useRef } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { MONTH_THEMES } from '../lib/constants';
import { makeParticle, drawParticle, updateParticle } from '../lib/particles';

export default function Scene() {
  const canvasRef = useRef(null);
  const gradientRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animFrameRef = useRef(null);
  const { currentMonth, mood } = useCalendar();

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Initialize particles when month or mood changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const theme = MONTH_THEMES[currentMonth];
    const count = mood === 'minimal' ? 16 : mood === 'energetic' ? 70 : 40;
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push(makeParticle(theme.particle, theme, canvas.width, canvas.height));
    }
    particlesRef.current = newParticles;
  }, [currentMonth, mood]);

  // Apply gradient theme
  useEffect(() => {
    const el = gradientRef.current;
    if (!el) return;
    const theme = MONTH_THEMES[currentMonth];
    const bg = theme.bg;
    el.style.background = `radial-gradient(ellipse at 35% 25%, ${bg[1]} 0%, ${bg[0]} 45%, ${bg[2]} 100%)`;
  }, [currentMonth]);

  // Mouse tracking for parallax + particle interaction
  useEffect(() => {
    const handler = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
      const el = gradientRef.current;
      if (el) {
        const mx = (mouseRef.current.x - 0.5) * 16;
        const my = (mouseRef.current.y - 0.5) * 10;
        el.style.transform = `translate(${mx}px, ${my}px) scale(1.08)`;
      }
    };
    document.addEventListener('mousemove', handler);
    return () => document.removeEventListener('mousemove', handler);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        updateParticle(p, mouseRef.current.x, mouseRef.current.y, canvas.width, canvas.height);
        drawParticle(ctx, p);
      });
      animFrameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div id="scene">
      <canvas id="scene-canvas" ref={canvasRef} />
      <div id="scene-gradient" ref={gradientRef} />
      <div id="scene-vignette" />
    </div>
  );
}

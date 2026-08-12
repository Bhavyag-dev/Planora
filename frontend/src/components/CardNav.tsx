import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './CardNav.css';

export interface CardNavLink {
  label: string;
  href?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

export interface CardNavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
}

export interface CardNavProps {
  logo?: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = 'rgba(255, 255, 255, 0.95)',
  menuColor = '#000',
  buttonBgColor = '#0a0a0a',
  buttonTextColor = '#fff',
  ctaText = 'Get Started',
  ctaHref = '/signup',
  onCtaClick
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const location = useLocation();

  const calculateHeight = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight; // force reflow

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  }, []);

  const openMenu = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    setIsExpanded(true);
    setIsHamburgerOpen(true);

    const targetHeight = calculateHeight();
    const validCards = cardsRef.current.filter(Boolean);

    gsap.killTweensOf([navEl, ...validCards]);

    gsap.to(navEl, {
      height: targetHeight,
      duration: 0.4,
      ease,
      overwrite: 'auto'
    });

    gsap.fromTo(
      validCards,
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.06, overwrite: 'auto' }
    );
  }, [calculateHeight, ease]);

  const closeMenu = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    setIsHamburgerOpen(false);
    const validCards = cardsRef.current.filter(Boolean);

    gsap.killTweensOf([navEl, ...validCards]);

    gsap.to(validCards, {
      y: 20,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      overwrite: 'auto'
    });

    gsap.to(navEl, {
      height: 60,
      duration: 0.35,
      ease,
      overwrite: 'auto',
      onComplete: () => {
        setIsExpanded(false);
      }
    });
  }, [ease]);

  const toggleMenu = () => {
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Close menu on route changes
  useEffect(() => {
    if (isExpanded) {
      closeMenu();
    }
  }, [location.pathname, closeMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isExpanded && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, closeMenu]);

  // Handle window resize dynamically
  useEffect(() => {
    const handleResize = () => {
      if (isExpanded && navRef.current) {
        const newHeight = calculateHeight();
        gsap.to(navRef.current, { height: newHeight, duration: 0.2, ease: 'power2.out' });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded, calculateHeight]);

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div ref={containerRef} className={`card-nav-container ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{ backgroundColor: baseColor }}>
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
              }
            }}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={{ color: menuColor || '#000' }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <Link to="/" className="logo-container" onClick={() => isExpanded && closeMenu()}>
            {logo ? (
              <img src={logo} alt={logoAlt} className="logo" />
            ) : (
              <span className="text-[28px] font-[900] tracking-tighter text-neutral-950 font-display flex items-baseline leading-none">
                Planora
                <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-none ml-0.5 shrink-0" />
              </span>
            )}
          </Link>

          {ctaHref.startsWith('/') ? (
            <Link
              to={ctaHref}
              onClick={() => {
                if (onCtaClick) onCtaClick();
                if (isExpanded) closeMenu();
              }}
              className="card-nav-cta-button"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              {ctaText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onCtaClick) onCtaClick();
                if (isExpanded) closeMenu();
              }}
              className="card-nav-cta-button"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              {ctaText}
            </button>
          )}
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => {
                  const isInternal = lnk.href && lnk.href.startsWith('/');
                  if (isInternal) {
                    return (
                      <Link
                        key={`${lnk.label}-${i}`}
                        className="nav-card-link"
                        to={lnk.href!}
                        aria-label={lnk.ariaLabel}
                        onClick={() => {
                          if (lnk.onClick) lnk.onClick();
                          closeMenu();
                        }}
                      >
                        <ArrowUpRight className="nav-card-link-icon" aria-hidden="true" size={14} />
                        {lnk.label}
                      </Link>
                    );
                  }
                  return (
                    <a
                      key={`${lnk.label}-${i}`}
                      className="nav-card-link"
                      href={lnk.href || '#'}
                      aria-label={lnk.ariaLabel}
                      onClick={() => {
                        if (lnk.onClick) lnk.onClick();
                        closeMenu();
                      }}
                    >
                      <ArrowUpRight className="nav-card-link-icon" aria-hidden="true" size={14} />
                      {lnk.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;

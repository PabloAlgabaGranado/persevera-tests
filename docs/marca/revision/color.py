"""Utilidades de color: contraste WCAG 2.x, CIEDE2000 y simulación de daltonismo (Machado 2009, severidad 1)."""
import math


def hex2rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def unlin(c):
    c = max(0.0, min(1.0, c))
    return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055


def lum(h):
    r, g, b = (lin(c) for c in hex2rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def cr(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def mezcla(fg, bg, alfa):
    f, b = hex2rgb(fg), hex2rgb(bg)
    return '#' + ''.join('%02X' % round((alfa * x + (1 - alfa) * y) * 255) for x, y in zip(f, b))


def lab(h):
    r, g, b = (lin(c) for c in hex2rgb(h))
    x = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047
    y = (0.2126729 * r + 0.7151522 * g + 0.0721750 * b)
    z = (0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / 1.08883
    f = lambda t: t ** (1 / 3) if t > 216 / 24389 else (24389 / 27 * t + 16) / 116
    fx, fy, fz = f(x), f(y), f(z)
    return 116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)


def hue(h):
    r, g, b = hex2rgb(h)
    mx, mn = max(r, g, b), min(r, g, b)
    if mx == mn:
        return 0
    d = mx - mn
    if mx == r:
        hh = ((g - b) / d) % 6
    elif mx == g:
        hh = (b - r) / d + 2
    else:
        hh = (r - g) / d + 4
    return round(hh * 60)


def de2000(c1, c2):
    L1, a1, b1 = lab(c1)
    L2, a2, b2 = lab(c2)
    C1, C2 = math.hypot(a1, b1), math.hypot(a2, b2)
    Cm = (C1 + C2) / 2
    G = 0.5 * (1 - math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)))
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p = math.degrees(math.atan2(b1, a1p)) % 360
    h2p = math.degrees(math.atan2(b2, a2p)) % 360
    dLp, dCp = L2 - L1, C2p - C1p
    if C1p * C2p == 0:
        dhp = 0
    else:
        dhp = h2p - h1p
        if dhp > 180:
            dhp -= 360
        elif dhp < -180:
            dhp += 360
    dHp = 2 * math.sqrt(C1p * C2p) * math.sin(math.radians(dhp / 2))
    Lm, Cmp = (L1 + L2) / 2, (C1p + C2p) / 2
    if C1p * C2p == 0:
        hm = h1p + h2p
    elif abs(h1p - h2p) <= 180:
        hm = (h1p + h2p) / 2
    elif h1p + h2p < 360:
        hm = (h1p + h2p + 360) / 2
    else:
        hm = (h1p + h2p - 360) / 2
    T = (1 - 0.17 * math.cos(math.radians(hm - 30)) + 0.24 * math.cos(math.radians(2 * hm))
         + 0.32 * math.cos(math.radians(3 * hm + 6)) - 0.20 * math.cos(math.radians(4 * hm - 63)))
    dth = 30 * math.exp(-((hm - 275) / 25) ** 2)
    Rc = 2 * math.sqrt(Cmp ** 7 / (Cmp ** 7 + 25 ** 7))
    Sl = 1 + 0.015 * (Lm - 50) ** 2 / math.sqrt(20 + (Lm - 50) ** 2)
    Sc = 1 + 0.045 * Cmp
    Sh = 1 + 0.015 * Cmp * T
    Rt = -math.sin(math.radians(2 * dth)) * Rc
    return math.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh))


MACHADO = {
    'deuter': ((0.367322, 0.860646, -0.227968), (0.280085, 0.672501, 0.047413), (-0.011820, 0.042940, 0.968881)),
    'protan': ((0.152286, 1.052583, -0.204868), (0.114503, 0.786281, 0.099216), (-0.003882, -0.048116, 1.051998)),
}


def sim(h, tipo):
    r, g, b = (lin(c) for c in hex2rgb(h))
    m = MACHADO[tipo]
    out = [m[i][0] * r + m[i][1] * g + m[i][2] * b for i in range(3)]
    return '#' + ''.join('%02X' % round(unlin(c) * 255) for c in out)


def de_cvd(a, b):
    return de2000(a, b), de2000(sim(a, 'deuter'), sim(b, 'deuter')), de2000(sim(a, 'protan'), sim(b, 'protan'))


def informe(nombre, textos, ui, distancias):
    """textos: (fg, bg, etiqueta, grande?)  ui: (fg, bg, etiqueta, decorativo?)"""
    fallos = []
    print(f'\n######## {nombre}')
    print('-- Texto (AA: 4,5 normal / 3 grande)')
    for fg, bg, et, *g in textos:
        grande = bool(g and g[0])
        r = cr(fg, bg)
        lim = 3 if grande else 4.5
        ok = r >= lim
        if not ok:
            fallos.append(et)
        print(f'  {"OK " if ok else "NO "} {r:5.2f}:1  {fg} sobre {bg}  {et}{" (grande)" if grande else ""}')
    print('-- Interfaz / gráficos (3:1)')
    for fg, bg, et, *d in ui:
        deco = bool(d and d[0])
        r = cr(fg, bg)
        ok = r >= 3
        if not ok and not deco:
            fallos.append(et)
        print(f'  {"OK " if ok else ("dec" if deco else "NO ")} {r:5.2f}:1  {fg} vs {bg}  {et}')
    print('-- Distancias (ΔE2000 normal / deuteranopía / protanopía), tonos HSL')
    for a, b, et in distancias:
        n, d, p = de_cvd(a, b)
        print(f'  {et}: {a} ({hue(a)}°) vs {b} ({hue(b)}°): ΔE {n:.1f} / {d:.1f} / {p:.1f}   lum {cr(a, b):.2f}:1')
    print('FALLOS AA:', fallos if fallos else 'ninguno')
    return fallos

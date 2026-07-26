// 生成品牌化 SVG 占位资源到 public/ —— 一次性脚本，可重复运行
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'public');
const C = { navy: '#061524', navy2: '#0f2f4d', energy: '#22c55e', electric: '#2563eb', cyan: '#0e7490', slate: '#64748b' };

function write(rel, svg) {
  const p = resolve(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, svg.trim() + '\n', 'utf8');
  console.log('✓', rel);
}

const grid = (w, h) => `
  <defs>
    <pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="${C.electric}" stroke-opacity="0.12"/>
    </pattern>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.navy}"/><stop offset="1" stop-color="${C.navy2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#g)"/>`;

const label = (x, y, t, fill = '#fff', size = 20, weight = 700) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="system-ui,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="middle">${t}</text>`;

// ---- 架构拓扑图 (16:9) ----
function arch(title, nodes) {
  const w = 960, h = 540;
  const boxes = nodes.map((n, i) => {
    const x = 120 + i * 220, y = 240, bw = 180, bh = 90;
    const line = i < nodes.length - 1 ? `<line x1="${x + bw}" y1="${y + bh / 2}" x2="${x + 220}" y2="${y + bh / 2}" stroke="${C.energy}" stroke-width="2" stroke-dasharray="6 4"/>` : '';
    return `${line}
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="12" fill="${C.navy2}" stroke="${C.electric}" stroke-opacity="0.5"/>
      ${label(x + bw / 2, y + bh / 2 + 6, n, C.energy, 16)}`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
    ${grid(w, h)}
    ${label(w / 2, 70, title, '#fff', 26)}
    ${label(w / 2, 105, '数字孪生数据链路', C.slate, 15, 500)}
    ${boxes}
  </svg>`;
}
write('images/arch/smart-park.svg', arch('智慧园区零碳数字孪生架构', ['现场采集', '边缘网关', '协议归一', '孪生大屏']));
write('images/arch/datacenter-pue.svg', arch('数据中心 PUE 优化架构', ['制冷/配电', '采集网关', 'PUE 仿真', '3D 气流']));
write('images/arch/factory-energy.svg', arch('高耗能工厂能效监测架构', ['产线仪表', '串口服务器', '边缘计算', '能效孪生']));

// ---- 产品图 (1:1) ----
function product(model, cat) {
  const s = 480;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" role="img" aria-label="${model}">
    ${grid(s, s)}
    <rect x="120" y="150" width="240" height="150" rx="16" fill="${C.navy2}" stroke="${C.energy}" stroke-opacity="0.6"/>
    ${[0, 1, 2, 3].map((i) => `<circle cx="${160 + i * 50}" cy="185" r="6" fill="${C.energy}"/>`).join('')}
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${150 + i * 30}" y="260" width="16" height="24" rx="2" fill="${C.electric}"/>`).join('')}
    ${label(s / 2, 360, model, '#fff', 30)}
    ${label(s / 2, 395, cat, C.slate, 16, 500)}
  </svg>`;
}
write('images/products/eg8000.svg', product('EG-8000', '边缘计算采集网关'));
write('images/products/dm300.svg', product('DM-300', '多功能智能电表'));
write('images/products/ss104.svg', product('SS-104', '工业串口服务器'));

// ---- 案例数字孪生截图 (16:9) ----
function twin(title) {
  const w = 960, h = 540;
  const bars = Array.from({ length: 9 }, (_, i) => {
    const bh = 40 + ((i * 53) % 160);
    return `<rect x="${140 + i * 80}" y="${420 - bh}" width="46" height="${bh}" rx="4" fill="${i % 2 ? C.energy : C.electric}" opacity="0.85"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
    ${grid(w, h)}
    ${label(w / 2, 80, title, '#fff', 24)}
    ${label(w / 2, 112, '能效数字孪生大屏 · 实时能耗热力', C.slate, 14, 500)}
    ${bars}
    <line x1="120" y1="420" x2="840" y2="420" stroke="${C.slate}" stroke-opacity="0.4"/>
  </svg>`;
}
write('images/cases/park-twin.svg', twin('长三角产业园区 · 零碳孪生大屏'));
write('images/cases/datacenter-twin.svg', twin('Tier III 数据中心 · PUE 孪生'));
write('images/cases/steel-twin.svg', twin('钢铁集团 · 产线能效孪生'));

// ---- 新闻封面 (16:9) ----
function cover(title, tag) {
  const w = 960, h = 540;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
    ${grid(w, h)}
    <rect x="60" y="60" width="120" height="34" rx="17" fill="${C.energy}" opacity="0.2"/>
    ${label(120, 83, tag, C.energy, 15, 600)}
    <foreignObject x="60" y="220" width="840" height="200">
      <div xmlns="http://www.w3.org/1999/xhtml" style="color:#fff;font:700 40px system-ui,sans-serif;line-height:1.3">${title}</div>
    </foreignObject>
  </svg>`;
}
write('images/news/opcua-modbus.svg', cover('OPC UA 与 Modbus 如何选型', '协议科普'));
write('images/news/policy-2026.svg', cover('2026 能耗在线监测新要求', '政策解读'));
write('images/news/heatmap.svg', cover('动态能耗热力图技术揭秘', '技术干货'));

// ---- 合作伙伴 logo (占位) ----
function logo(name) {
  const w = 200, h = 80;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${name}">
    <rect width="${w}" height="${h}" rx="10" fill="${C.navy2}"/>
    <circle cx="34" cy="40" r="16" fill="none" stroke="${C.energy}" stroke-width="3"/>
    ${label(120, 46, name, '#e2e8f0', 18, 600)}
  </svg>`;
}
for (const p of [['huawei', '华为云 IoT'], ['tencent', '腾讯云'], ['aliyun', '阿里云 IoT'], ['schneider', '施耐德'], ['siemens', '西门子'], ['advantech', '研华科技']]) {
  write(`images/partners/${p[0]}.svg`, logo(p[1]));
}

console.log('资源生成完成');

import React, { useEffect, useState, useRef } from 'react';
import {
  Activity, AlertTriangle, CheckCircle,
  Thermometer, Wind, Droplets, Eye, Video, Sliders,
  Package, Heart, Egg, Syringe, ShoppingCart, Briefcase,
  Layers, X, TrendingUp, CheckSquare, Plus, AlertCircle, AlertOctagon, Feather,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, RotateCcw, Compass, Crosshair, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
});

// Types
type FarmType = 'BROILER' | 'LAYER' | 'BREEDER';
type AlertSeverity = 'critical' | 'warning' | 'info';

interface ShedEnvData {
  id: string;
  name: string;
  farmName: string;
  birds: number;
  batchCode: string;
  batchAgeDays: number;
  batchType: string;
  temp: number;
  tempTargetMin: number;
  tempTargetMax: number;
  tempStatus: 'normal' | 'warning' | 'critical';
  humidity: number;
  humidityTargetMin: number;
  humidityTargetMax: number;
  humidityStatus: 'normal' | 'warning' | 'critical';
  airQuality: 'Good' | 'Fair' | 'Poor';
  ventilation: 'NORMAL' | 'HIGH' | 'LOW';
  waterStatus: 'AVAILABLE' | 'LOW' | 'UNAVAILABLE';
  feedStatus: 'AVAILABLE' | 'LOW' | 'EMPTY';
  lightingStatus: 'ON' | 'OFF' | 'AUTO';
  cameraStatus: 'ONLINE' | 'OFFLINE';
  healthStatus: 'Healthy' | 'Attention Required' | 'Critical';
}

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE';
  lastUpdated: string;
  fps: number;
}

interface EquipmentItem {
  id: string;
  name: string;
  shedName: string;
  type: 'Fan' | 'Ventilation' | 'Lights' | 'Water Pump' | 'Cooling' | 'Heater';
  mode: 'AUTO' | 'ON' | 'OFF';
  hardwareConnected: boolean;
}

interface OperationalAlert {
  id: string;
  category: 'CRITICAL' | 'WARNING' | 'INFO';
  severity: AlertSeverity;
  shedName: string;
  title: string;
  message: string;
  action: string;
  timestamp: string;
}

// Initial Mock Operational Data for Command Center
const INITIAL_SHEDS: ShedEnvData[] = [
  {
    id: 'shed-a',
    name: 'Shed A',
    farmName: 'North Valley Farm',
    birds: 9720,
    batchCode: 'BR-2026-004',
    batchAgeDays: 24,
    batchType: 'Broiler',
    temp: 26.4,
    tempTargetMin: 24.0,
    tempTargetMax: 28.0,
    tempStatus: 'normal',
    humidity: 62,
    humidityTargetMin: 55,
    humidityTargetMax: 70,
    humidityStatus: 'normal',
    airQuality: 'Good',
    ventilation: 'NORMAL',
    waterStatus: 'AVAILABLE',
    feedStatus: 'AVAILABLE',
    lightingStatus: 'AUTO',
    cameraStatus: 'ONLINE',
    healthStatus: 'Healthy'
  },
  {
    id: 'shed-b',
    name: 'Shed B',
    farmName: 'North Valley Farm',
    birds: 8950,
    batchCode: 'BR-2026-005',
    batchAgeDays: 28,
    batchType: 'Broiler',
    temp: 31.2,
    tempTargetMin: 23.0,
    tempTargetMax: 27.5,
    tempStatus: 'warning',
    humidity: 76,
    humidityTargetMin: 50,
    humidityTargetMax: 70,
    humidityStatus: 'warning',
    airQuality: 'Fair',
    ventilation: 'HIGH',
    waterStatus: 'LOW',
    feedStatus: 'AVAILABLE',
    lightingStatus: 'ON',
    cameraStatus: 'ONLINE',
    healthStatus: 'Attention Required'
  },
  {
    id: 'shed-c',
    name: 'Shed C (Layer)',
    farmName: 'Green Meadow Layer Farm',
    birds: 14500,
    batchCode: 'LY-2025-012',
    batchAgeDays: 140,
    batchType: 'Layer',
    temp: 24.8,
    tempTargetMin: 22.0,
    tempTargetMax: 26.0,
    tempStatus: 'normal',
    humidity: 58,
    humidityTargetMin: 50,
    humidityTargetMax: 65,
    humidityStatus: 'normal',
    airQuality: 'Good',
    ventilation: 'NORMAL',
    waterStatus: 'AVAILABLE',
    feedStatus: 'AVAILABLE',
    lightingStatus: 'AUTO',
    cameraStatus: 'ONLINE',
    healthStatus: 'Healthy'
  },
  {
    id: 'shed-d',
    name: 'Shed D',
    farmName: 'Green Meadow Layer Farm',
    birds: 12200,
    batchCode: 'LY-2025-013',
    batchAgeDays: 110,
    batchType: 'Layer',
    temp: 25.1,
    tempTargetMin: 22.0,
    tempTargetMax: 26.0,
    tempStatus: 'normal',
    humidity: 60,
    humidityTargetMin: 50,
    humidityTargetMax: 65,
    humidityStatus: 'normal',
    airQuality: 'Good',
    ventilation: 'NORMAL',
    waterStatus: 'AVAILABLE',
    feedStatus: 'AVAILABLE',
    lightingStatus: 'AUTO',
    cameraStatus: 'ONLINE',
    healthStatus: 'Healthy'
  }
];

const INITIAL_CAMERAS: CameraFeed[] = [
  { id: 'cam-1', name: 'Shed A Internal PTZ', location: 'Shed A - Hen Dept Main Bay', status: 'ONLINE', lastUpdated: 'Just now', fps: 30 },
  { id: 'cam-2', name: 'Shed B Internal PTZ', location: 'Shed B - Broiler Corridor', status: 'ONLINE', lastUpdated: 'Just now', fps: 30 },
  { id: 'cam-3', name: 'Feed Silo Camera', location: 'Central Storage & Hopper', status: 'ONLINE', lastUpdated: '2 mins ago', fps: 20 },
  { id: 'cam-4', name: 'Egg Collection Room', location: 'Shed C & D Hub', status: 'ONLINE', lastUpdated: 'Just now', fps: 30 },
  { id: 'cam-5', name: 'Farm Main Gate', location: 'Entry Perimeter', status: 'ONLINE', lastUpdated: 'Just now', fps: 30 },
  { id: 'cam-6', name: 'Shed E Expansion', location: 'Shed E Construction', status: 'OFFLINE', lastUpdated: '1 hour ago', fps: 0 },
];

const INITIAL_EQUIPMENT: EquipmentItem[] = [
  { id: 'eq-1', name: 'Exhaust Fans Group 1', shedName: 'Shed A', type: 'Fan', mode: 'AUTO', hardwareConnected: false },
  { id: 'eq-2', name: 'Tunnel Ventilation', shedName: 'Shed A', type: 'Ventilation', mode: 'AUTO', hardwareConnected: false },
  { id: 'eq-3', name: 'Shed A Lighting System', shedName: 'Shed A', type: 'Lights', mode: 'AUTO', hardwareConnected: false },
  { id: 'eq-4', name: 'Main Water Pressure Pump', shedName: 'Shed A', type: 'Water Pump', mode: 'AUTO', hardwareConnected: false },
  { id: 'eq-5', name: 'Exhaust Fans Group 2', shedName: 'Shed B', type: 'Fan', mode: 'ON', hardwareConnected: false },
  { id: 'eq-6', name: 'Cooling Pad System', shedName: 'Shed B', type: 'Cooling', mode: 'ON', hardwareConnected: false },
];

export const FarmDashboard: React.FC = () => {
  const navigate = useNavigate();

  // State Management
  const [farmType, setFarmType] = useState<FarmType>('BROILER');
  const [sheds] = useState<ShedEnvData[]>(INITIAL_SHEDS);
  const [cameras] = useState<CameraFeed[]>(INITIAL_CAMERAS);
  const [equipment, setEquipment] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT);
  const [time, setTime] = useState(new Date());

  // PTZ Camera Control Suite State
  const [panAngle, setPanAngle] = useState(0); // -180 to 180 deg
  const [tiltAngle, setTiltAngle] = useState(15); // -90 to 90 deg
  const [zoomLevel, setZoomLevel] = useState(1.5); // 1.0x to 5.0x
  const [activeCorner, setActiveCorner] = useState<'OVERVIEW' | 'NESTING' | 'FEEDING' | 'WATER' | 'ROOSTING' | 'ENTRANCE'>('OVERVIEW');
  const [selectedPtzShed, setSelectedPtzShed] = useState('Shed A Internal PTZ (Hen Dept)');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Preload Realistic Hen Farm Camera Feed Photos
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});

  useEffect(() => {
    const imgNesting = new Image(); imgNesting.src = '/hen_farm_nesting.png';
    const imgFeeding = new Image(); imgFeeding.src = '/hen_farm_feeding.png';
    const imgOverview = new Image(); imgOverview.src = '/hen_farm_overview.png';

    imagesRef.current = {
      NESTING: imgNesting,
      FEEDING: imgFeeding,
      WATER: imgFeeding,
      ROOSTING: imgOverview,
      ENTRANCE: imgOverview,
      OVERVIEW: imgOverview
    };
  }, []);

  // Canvas Drawing Effect for Live PTZ Camera Simulation with Realistic Photos
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Clear Canvas Background (Dark Shed Surveillance Mode)
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      // Select Active Corner Real Photo
      const currentImg = imagesRef.current[activeCorner] || imagesRef.current.OVERVIEW;

      ctx.save();

      // Apply Pan, Tilt, Zoom Transformations around canvas center
      const panOffset = (panAngle % 360) * 2.2;
      const tiltOffset = (tiltAngle % 90) * 2.2;

      ctx.translate(w / 2 + panOffset, h / 2 + tiltOffset);
      ctx.scale(zoomLevel, zoomLevel);

      if (currentImg && currentImg.complete && currentImg.naturalWidth !== 0) {
        // Draw High-Resolution Hen Farm Camera Photo centered
        const imgW = w * 1.4;
        const imgH = h * 1.4;
        ctx.drawImage(currentImg, -imgW / 2, -imgH / 2, imgW, imgH);
      } else {
        // Fallback Dark Grid
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-w, -h, w * 2, h * 2);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.fillText('LOADING LIVE CAMERA STREAM...', -100, 0);
      }

      // Draw Simulated AI Bird Bounding Boxes / AI Tracking Targets
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 1.5;
      ctx.font = '9px monospace';
      ctx.fillStyle = '#4ade80';

      const birdTargets = [
        { x: -80 + Math.sin(frame * 0.03) * 15, y: -40 + Math.cos(frame * 0.02) * 10, tag: 'HEN-402 • 2.1kg' },
        { x: 60 + Math.cos(frame * 0.03) * 20, y: 30 + Math.sin(frame * 0.02) * 15, tag: 'HEN-118 • LAYING' },
        { x: -140 + Math.sin(frame * 0.02) * 10, y: 80, tag: 'HEN-904 • HEALTHY' },
        { x: 120, y: -90 + Math.cos(frame * 0.03) * 10, tag: 'HEN-771 • FEEDING' }
      ];

      birdTargets.forEach(target => {
        ctx.strokeRect(target.x, target.y, 42, 42);
        ctx.fillText(target.tag, target.x - 5, target.y - 4);
      });

      ctx.restore();

      // Camera Crosshair Overlay & Surveillance HUD Overlay
      const cx = w / 2;
      const cy = h / 2;

      // Scanning HUD Line
      const scanY = (frame * 2) % h;
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();

      // Center Green Optics Reticle
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.moveTo(cx - 38, cy); ctx.lineTo(cx - 14, cy);
      ctx.moveTo(cx + 14, cy); ctx.lineTo(cx + 38, cy);
      ctx.moveTo(cx, cy - 38); ctx.lineTo(cx, cy - 14);
      ctx.moveTo(cx, cy + 14); ctx.lineTo(cx, cy + 38);
      ctx.stroke();

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      // HUD Corner Framing Reticles
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.4)';
      ctx.lineWidth = 2;
      const margin = 20; const len = 16;
      // Top-Left
      ctx.beginPath(); ctx.moveTo(margin, margin + len); ctx.lineTo(margin, margin); ctx.lineTo(margin + len, margin); ctx.stroke();
      // Top-Right
      ctx.beginPath(); ctx.moveTo(w - margin - len, margin); ctx.lineTo(w - margin, margin); ctx.lineTo(w - margin, margin + len); ctx.stroke();
      // Bottom-Left
      ctx.beginPath(); ctx.moveTo(margin, h - margin - len); ctx.lineTo(margin, h - margin); ctx.lineTo(margin + len, h - margin); ctx.stroke();
      // Bottom-Right
      ctx.beginPath(); ctx.moveTo(w - margin - len, h - margin); ctx.lineTo(w - margin, h - margin); ctx.lineTo(w - margin, h - margin - len); ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [panAngle, tiltAngle, zoomLevel, activeCorner]);

  const handlePresetChange = (corner: 'OVERVIEW' | 'NESTING' | 'FEEDING' | 'WATER' | 'ROOSTING' | 'ENTRANCE') => {
    setActiveCorner(corner);
    if (corner === 'NESTING') { setPanAngle(-80); setTiltAngle(30); setZoomLevel(2.5); }
    else if (corner === 'FEEDING') { setPanAngle(120); setTiltAngle(10); setZoomLevel(2.2); }
    else if (corner === 'WATER') { setPanAngle(-110); setTiltAngle(15); setZoomLevel(2.2); }
    else if (corner === 'ROOSTING') { setPanAngle(0); setTiltAngle(20); setZoomLevel(2.0); }
    else if (corner === 'ENTRANCE') { setPanAngle(80); setTiltAngle(-10); setZoomLevel(1.8); }
    else { setPanAngle(0); setTiltAngle(15); setZoomLevel(1.5); }
  };


  // Metrics from API
  const [totalBirds, setTotalBirds] = useState(57000);
  const [todayMortality, setTodayMortality] = useState(18);
  const [todayEggs, setTodayEggs] = useState(30470);
  const [, setTodayFeedKg] = useState(2170);
  const [feedStockKg, setFeedStockKg] = useState(11850);

  const [alerts, setAlerts] = useState<OperationalAlert[]>([
    {
      id: 'alt-1',
      category: 'CRITICAL',
      severity: 'critical',
      shedName: 'Shed B',
      title: 'High Temperature Warning',
      message: 'Shed B temperature reached 31.2°C (target 23.0°C - 27.5°C).',
      action: 'Increase Ventilation',
      timestamp: '12 mins ago'
    },
    {
      id: 'alt-2',
      category: 'WARNING',
      severity: 'warning',
      shedName: 'Central Silo',
      title: 'Broiler Finisher Feed Low',
      message: 'Current stock 850 kg (below reorder threshold of 1,200 kg).',
      action: 'Create Reorder Order',
      timestamp: '25 mins ago'
    },
    {
      id: 'alt-3',
      category: 'INFO',
      severity: 'info',
      shedName: 'Shed A',
      title: 'Vaccination Reminder',
      message: 'Gumboro Booster scheduled for Batch BR-2026-004 tomorrow.',
      action: 'View Health Plan',
      timestamp: '1 hour ago'
    }
  ]);

  // Operations Tasks Checklist State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Morning mortality collection & log', completed: true, shed: 'All Sheds' },
    { id: 2, title: 'Check water line pressure & nipples', completed: true, shed: 'Shed A & B' },
    { id: 3, title: 'Record 12:00 PM egg collection count', completed: false, shed: 'Shed C & D' },
    { id: 4, title: 'Refill feed hopper from Silo 2', completed: false, shed: 'Shed B' },
    { id: 5, title: 'Verify tunnel ventilation fan belts', completed: false, shed: 'Shed B' },
  ]);

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedShed, setSelectedShed] = useState<ShedEnvData | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<CameraFeed | null>(null);
  const [safetyOverrideItem, setSafetyOverrideItem] = useState<{ item: EquipmentItem; targetMode: 'ON' | 'OFF' | 'AUTO' } | null>(null);

  // Form states for Quick Actions
  const [mortalityQty, setMortalityQty] = useState('');
  const [mortalityReason, setMortalityReason] = useState('Natural / Culling');
  const [mortalityShedId, setMortalityShedId] = useState('shed-a');

  const [feedQtyKg, setFeedQtyKg] = useState('');
  const [feedTypeInput, setFeedTypeInput] = useState('Broiler Finisher Pellets');

  const [eggGoodQty, setEggGoodQty] = useState('');
  const [eggDamagedQty, setEggDamagedQty] = useState('');

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Dashboard Stats from Backend
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API}/dashboard`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (data.totalBirds) setTotalBirds(data.totalBirds);
          if (data.todayMortality) setTodayMortality(data.todayMortality);
          if (data.todayEggs) setTodayEggs(data.todayEggs);
          if (data.todayFeedKg) setTodayFeedKg(data.todayFeedKg);
          if (data.feedStockKg) setFeedStockKg(data.feedStockKg);
          if (data.alerts && data.alerts.length > 0) setAlerts(data.alerts);
        }
      } catch (err) {
        // Fallback to sample operational data
      }
    };
    fetchDashboard();
  }, []);

  // Determine overall farm status
  const hasCritical = sheds.some(s => s.tempStatus === 'critical' || s.healthStatus === 'Critical') || alerts.some(a => a.severity === 'critical');
  const hasWarning = sheds.some(s => s.tempStatus === 'warning' || s.healthStatus === 'Attention Required') || alerts.some(a => a.severity === 'warning');
  const overallFarmStatus = hasCritical ? 'Critical' : hasWarning ? 'Attention Required' : 'Healthy';

  // Toggle Equipment Mode with Safety Check
  const handleEquipmentToggle = (item: EquipmentItem, newMode: 'AUTO' | 'ON' | 'OFF') => {
    const currentShed = sheds.find(s => s.name === item.shedName);
    if (currentShed && currentShed.tempStatus === 'warning' && newMode === 'OFF' && item.type === 'Ventilation') {
      // Trigger Safety Confirmation before manual override
      setSafetyOverrideItem({ item, targetMode: newMode });
      return;
    }
    setEquipment(prev => prev.map(e => e.id === item.id ? { ...e, mode: newMode } : e));
  };

  const confirmSafetyOverride = () => {
    if (safetyOverrideItem) {
      const { item, targetMode } = safetyOverrideItem;
      setEquipment(prev => prev.map(e => e.id === item.id ? { ...e, mode: targetMode } : e));
      setSafetyOverrideItem(null);
    }
  };

  // Submit Handlers
  const handleRecordMortality = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(mortalityQty) || 0;
    if (qty > 0) {
      setTodayMortality(prev => prev + qty);
      setTotalBirds(prev => Math.max(0, prev - qty));
      setMortalityQty('');
      setActiveModal(null);
    }
  };

  const handleRecordFeed = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(feedQtyKg) || 0;
    if (qty > 0) {
      setTodayFeedKg(prev => prev + qty);
      setFeedStockKg(prev => Math.max(0, prev - qty));
      setFeedQtyKg('');
      setActiveModal(null);
    }
  };

  const handleRecordEggProduction = (e: React.FormEvent) => {
    e.preventDefault();
    const good = parseInt(eggGoodQty) || 0;
    const damaged = parseInt(eggDamagedQty) || 0;
    if (good + damaged > 0) {
      setTodayEggs(prev => prev + good + damaged);
      setEggGoodQty('');
      setEggDamagedQty('');
      setActiveModal(null);
    }
  };

  return (
    <div className="farm-page">
      {/* ── TOP HEADER ────────────────────────────────────────────────────────── */}
      <div className="farm-page-header">
        <div className="farm-header-left">
          <div className="farm-brand-pill">
            <Activity size={14} /> NOVAX POULTRY FARM COMMAND CENTER
          </div>
          <h1 className="farm-page-title">Operational Control Panel</h1>
          <p className="farm-page-subtitle">
            Location: <strong>North Valley Main Farm</strong> &bull;&nbsp;
            {time.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
            &nbsp;&mdash;&nbsp;
            {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>

        <div className="farm-header-right">
          {/* Farm Type Adaptability Switcher */}
          <div className="farm-type-selector">
            <button
              className={`farm-type-btn ${farmType === 'BROILER' ? 'active' : ''}`}
              onClick={() => setFarmType('BROILER')}
            >
              🍗 Broiler Farm
            </button>
            <button
              className={`farm-type-btn ${farmType === 'LAYER' ? 'active' : ''}`}
              onClick={() => setFarmType('LAYER')}
            >
              🥚 Layer Farm
            </button>
            <button
              className={`farm-type-btn ${farmType === 'BREEDER' ? 'active' : ''}`}
              onClick={() => setFarmType('BREEDER')}
            >
              🐣 Breeder Farm
            </button>
          </div>

          {/* Overall Farm Status Badge */}
          <div className={`farm-status-badge ${overallFarmStatus.toLowerCase().replace(' ', '-')}`}>
            <div className={`status-dot ${overallFarmStatus.toLowerCase().replace(' ', '-')}`} />
            <span>Farm Status: {overallFarmStatus.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS BAR ─────────────────────────────────────────────────── */}
      <div className="pf-quick-bar">
        <button className="pf-quick-btn pf-quick-btn--primary" onClick={() => setActiveModal('mortality')}>
          <Plus size={15} /> Record Mortality
        </button>
        <button className="pf-quick-btn" onClick={() => setActiveModal('feed')}>
          <Package size={15} /> Record Feed Usage
        </button>
        {farmType === 'LAYER' && (
          <button className="pf-quick-btn" onClick={() => setActiveModal('eggs')}>
            <Egg size={15} /> Record Egg Production
          </button>
        )}
        <button className="pf-quick-btn" onClick={() => navigate('/farm/vaccinations')}>
          <Syringe size={15} /> Add Health Record
        </button>
        <button className="pf-quick-btn" onClick={() => navigate('/farm/purchases')}>
          <ShoppingCart size={15} /> Create Purchase Order
        </button>
        <button className="pf-quick-btn" onClick={() => navigate('/farm/sales')}>
          <Briefcase size={15} /> Record Sale Order
        </button>
      </div>

      {/* ── FARM HEALTH OVERVIEW (OPERATIONAL KPIS) ────────────────────────────── */}
      <div className="pf-kpi-bar">
        <div className="pf-kpi-card">
          <div className="pf-kpi-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <Feather size={22} />
          </div>
          <div className="pf-kpi-info">
            <span className="pf-kpi-num">{totalBirds.toLocaleString('en-IN')}</span>
            <span className="pf-kpi-label">Live Birds Active</span>
            <span className="pf-kpi-sub">Across 4 Active Batches</span>
          </div>
        </div>

        <div className="pf-kpi-card">
          <div className="pf-kpi-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Layers size={22} />
          </div>
          <div className="pf-kpi-info">
            <span className="pf-kpi-num">6 / 6</span>
            <span className="pf-kpi-label">Active Sheds</span>
            <span className="pf-kpi-sub">100% Capacity Operational</span>
          </div>
        </div>

        <div className="pf-kpi-card">
          <div className="pf-kpi-icon" style={{ background: todayMortality > 15 ? '#fef2f2' : '#f0fdf4', color: todayMortality > 15 ? '#dc2626' : '#16a34a' }}>
            <Heart size={22} />
          </div>
          <div className="pf-kpi-info">
            <span className="pf-kpi-num">{todayMortality}</span>
            <span className="pf-kpi-label">Mortality Today</span>
            <span className="pf-kpi-sub">0.03% (Normal &lt; 0.05%)</span>
          </div>
        </div>

        {farmType === 'LAYER' ? (
          <div className="pf-kpi-card">
            <div className="pf-kpi-icon" style={{ background: '#faf5ff', color: '#9333ea' }}>
              <Egg size={22} />
            </div>
            <div className="pf-kpi-info">
              <span className="pf-kpi-num">{todayEggs.toLocaleString('en-IN')}</span>
              <span className="pf-kpi-label">Egg Production Today</span>
              <span className="pf-kpi-sub">94.2% Production Rate</span>
            </div>
          </div>
        ) : (
          <div className="pf-kpi-card">
            <div className="pf-kpi-icon" style={{ background: '#faf5ff', color: '#9333ea' }}>
              <TrendingUp size={22} />
            </div>
            <div className="pf-kpi-info">
              <span className="pf-kpi-num">2.45 kg</span>
              <span className="pf-kpi-label">Avg Bird Weight</span>
              <span className="pf-kpi-sub">FCR: 1.58 (Target 1.60)</span>
            </div>
          </div>
        )}

        <div className="pf-kpi-card">
          <div className="pf-kpi-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Package size={22} />
          </div>
          <div className="pf-kpi-info">
            <span className="pf-kpi-num">{(feedStockKg / 1000).toFixed(1)} Tons</span>
            <span className="pf-kpi-label">Feed Available</span>
            <span className="pf-kpi-sub">Est. 5.4 Days Remaining</span>
          </div>
        </div>

        <div className="pf-kpi-card">
          <div className="pf-kpi-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Droplets size={22} />
          </div>
          <div className="pf-kpi-info">
            <span className="pf-kpi-num">NORMAL</span>
            <span className="pf-kpi-label">Water Line Pressure</span>
            <span className="pf-kpi-sub">Flow Rate: 42 L/min</span>
          </div>
        </div>
      </div>

      {/* ── BIRD ENVIRONMENT & COMFORT MONITOR ────────────────────────────────── */}
      <div className="pf-section-header">
        <h2 className="pf-section-title">
          <Thermometer size={18} /> Environment & Bird Comfort Monitor
        </h2>
        <span className="pf-section-tag">Real-Time Sensor Telemetry</span>
      </div>

      <div className="pf-env-grid">
        {sheds.map(shed => (
          <div key={shed.id} className="pf-shed-env-card">
            <div className="pf-shed-env-header">
              <div>
                <div className="pf-shed-name">{shed.name}</div>
                <div className="pf-shed-meta">{shed.batchCode} &bull; {shed.birds.toLocaleString('en-IN')} birds &bull; Day {shed.batchAgeDays}</div>
              </div>
              <span className={`pf-badge ${shed.tempStatus}`}>
                {shed.tempStatus === 'normal' ? 'NORMAL COMFORT' : shed.tempStatus === 'warning' ? 'TEMP WARNING' : 'CRITICAL'}
              </span>
            </div>

            <div className="pf-env-metrics-grid">
              {/* Temperature */}
              <div className="pf-env-tile">
                <div className="pf-env-tile-header">
                  <span>Temperature</span>
                  <Thermometer size={14} />
                </div>
                <div className="pf-env-value">{shed.temp.toFixed(1)}°C</div>
                <div className="pf-env-target">Target: {shed.tempTargetMin}°C &ndash; {shed.tempTargetMax}°C</div>
              </div>

              {/* Humidity */}
              <div className="pf-env-tile">
                <div className="pf-env-tile-header">
                  <span>Humidity</span>
                  <Droplets size={14} />
                </div>
                <div className="pf-env-value">{shed.humidity}%</div>
                <div className="pf-env-target">Target: {shed.humidityTargetMin}% &ndash; {shed.humidityTargetMax}%</div>
              </div>

              {/* Air Quality & Ventilation */}
              <div className="pf-env-tile">
                <div className="pf-env-tile-header">
                  <span>Air Quality</span>
                  <Wind size={14} />
                </div>
                <div className="pf-env-value" style={{ fontSize: '1rem' }}>{shed.airQuality}</div>
                <div className="pf-env-target">Ventilation: <strong>{shed.ventilation}</strong></div>
              </div>

              {/* Water & Feed */}
              <div className="pf-env-tile">
                <div className="pf-env-tile-header">
                  <span>Water & Feed</span>
                  <Droplets size={14} />
                </div>
                <div className="pf-env-value" style={{ fontSize: '0.9rem' }}>
                  <span className={`pf-badge ${shed.waterStatus.toLowerCase()}`}>Water {shed.waterStatus}</span>
                </div>
                <div className="pf-env-target">Feed Supply: <strong>{shed.feedStatus}</strong></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── BIRD AGE / STAGE GUIDANCE ─────────────────────────────────────────── */}
      <div className="pf-flock-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle size={16} /> Flock Stage & Environmental Target Guidance
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Flock ID: BR-2026-004 &bull; Active Broiler Batch</span>
        </div>
        <div className="pf-flock-grid">
          <div className="pf-flock-item">
            <span className="pf-flock-label">Flock Age</span>
            <span className="pf-flock-val">24 Days</span>
          </div>
          <div className="pf-flock-item">
            <span className="pf-flock-label">Stage</span>
            <span className="pf-flock-val">Finisher Phase</span>
          </div>
          <div className="pf-flock-item">
            <span className="pf-flock-label">Recommended Temp</span>
            <span className="pf-flock-val">24.0°C &ndash; 28.0°C</span>
          </div>
          <div className="pf-flock-item">
            <span className="pf-flock-label">Recommended Humidity</span>
            <span className="pf-flock-val">55% &ndash; 70%</span>
          </div>
          <div className="pf-flock-item">
            <span className="pf-flock-label">Feed Requirement</span>
            <span className="pf-flock-val">120 g / bird / day</span>
          </div>
          <div className="pf-flock-item">
            <span className="pf-flock-label">Water Target</span>
            <span className="pf-flock-val">240 ml / bird / day</span>
          </div>
        </div>
      </div>

      {/* ── FARM & SHED STATUS (CLICKABLE SHED DETAILS) ───────────────────────── */}
      <div className="pf-section-header">
        <h2 className="pf-section-title">
          <Layers size={18} /> Farm & Shed Status Overview
        </h2>
        <span className="pf-section-tag">Click any shed for full diagnostic modal</span>
      </div>

      <div className="pf-sheds-row">
        {sheds.map(shed => (
          <div
            key={shed.id}
            className="pf-shed-card"
            onClick={() => { setSelectedShed(shed); setActiveModal('shedDetail'); }}
          >
            <div className="pf-shed-card-header">
              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{shed.name}</span>
              <span className={`pf-badge ${shed.healthStatus === 'Healthy' ? 'healthy' : 'warning'}`}>
                {shed.healthStatus}
              </span>
            </div>
            <div className="pf-shed-card-body">
              <div className="pf-shed-stat">
                <span>Birds</span>
                <strong>{shed.birds.toLocaleString('en-IN')}</strong>
              </div>
              <div className="pf-shed-stat">
                <span>Temp</span>
                <strong>{shed.temp.toFixed(1)}°C</strong>
              </div>
              <div className="pf-shed-stat">
                <span>Humidity</span>
                <strong>{shed.humidity}%</strong>
              </div>
              <div className="pf-shed-stat">
                <span>Camera</span>
                <strong style={{ color: shed.cameraStatus === 'ONLINE' ? '#16a34a' : '#dc2626' }}>{shed.cameraStatus}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── HEN DEPARTMENT INTERACTIVE PTZ CAMERA CONTROL SUITE ─────────── */}
      <div className="pf-section-header">
        <h2 className="pf-section-title">
          <Compass size={18} /> Hen Department Interactive PTZ Camera Control & Corner Inspection
        </h2>
        <span className="pf-section-tag" style={{ background: '#dcfce7', color: '#15803d' }}>
          Pan-Tilt-Zoom Active &bull; 360° Shed Coverage
        </span>
      </div>

      <div className="pf-ptz-container">
        {/* Live Canvas Camera Viewport */}
        <div className="pf-ptz-viewport">
          <div className="pf-ptz-hud-top">
            <div style={{ background: 'rgba(15,23,42,0.8)', color: '#f8fafc', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="rec-dot" /> LIVE PTZ SURVEILLANCE &bull; {selectedPtzShed}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', borderRadius: '6px', fontSize: '0.75rem', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
                value={selectedPtzShed}
                onChange={e => setSelectedPtzShed(e.target.value)}
              >
                <option>Shed A Internal PTZ (Hen Dept)</option>
                <option>Shed B Internal PTZ (Broiler)</option>
                <option>Shed C (Layer Nesting Bay)</option>
                <option>Shed D (Layer Main Trough)</option>
              </select>
            </div>
          </div>

          <canvas ref={canvasRef} width={640} height={380} className="pf-ptz-canvas" />

          <div className="pf-ptz-hud-bottom">
            <span>PAN: <strong style={{ color: '#38bdf8' }}>{panAngle}°</strong> &bull; TILT: <strong style={{ color: '#38bdf8' }}>{tiltAngle}°</strong> &bull; ZOOM: <strong style={{ color: '#4ade80' }}>{zoomLevel.toFixed(1)}x</strong></span>
            <span>CORNER / ZONE: <strong style={{ color: '#fef08a' }}>{activeCorner}</strong></span>
          </div>
        </div>

        {/* PTZ D-Pad & Corner Controls Panel */}
        <div className="pf-ptz-panel">
          <div className="pf-ptz-panel-title">
            <span>HEN DEPT PTZ CONTROLS</span>
            <Crosshair size={16} color="#38bdf8" />
          </div>

          {/* Directional D-Pad */}
          <div className="pf-ptz-dpad-wrapper">
            <div className="pf-ptz-dpad">
              <div />
              <button className="pf-ptz-btn" title="Tilt Up" onClick={() => setTiltAngle(prev => Math.min(90, prev + 10))}>
                <ArrowUp size={18} />
              </button>
              <div />

              <button className="pf-ptz-btn" title="Pan Left" onClick={() => setPanAngle(prev => (prev - 15))}>
                <ArrowLeft size={18} />
              </button>
              <button className="pf-ptz-btn center" title="Reset View" onClick={() => handlePresetChange('OVERVIEW')}>
                <RotateCcw size={14} />
              </button>
              <button className="pf-ptz-btn" title="Pan Right" onClick={() => setPanAngle(prev => (prev + 15))}>
                <ArrowRight size={18} />
              </button>

              <div />
              <button className="pf-ptz-btn" title="Tilt Down" onClick={() => setTiltAngle(prev => Math.max(-90, prev - 10))}>
                <ArrowDown size={18} />
              </button>
              <div />
            </div>
          </div>

          {/* Zoom Slider / Controls */}
          <div className="pf-ptz-zoom-row">
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600, flex: 1 }}>ZOOM CONTROL</span>
            <button className="pf-ptz-zoom-btn" title="Zoom Out" onClick={() => setZoomLevel(prev => Math.max(1.0, prev - 0.5))}>
              <ZoomOut size={14} />
            </button>
            <span style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 800, minWidth: '34px', textAlign: 'center' }}>{zoomLevel.toFixed(1)}x</span>
            <button className="pf-ptz-zoom-btn" title="Zoom In" onClick={() => setZoomLevel(prev => Math.min(5.0, prev + 0.5))}>
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Corner / Zone Quick Preset Selection */}
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, marginTop: '0.2rem' }}>
            INSPECT SHED CORNERS:
          </div>
          <div className="pf-ptz-presets-grid">
            <button className={`pf-preset-btn ${activeCorner === 'NESTING' ? 'active' : ''}`} onClick={() => handlePresetChange('NESTING')}>
              <Target size={12} /> Nesting Boxes
            </button>
            <button className={`pf-preset-btn ${activeCorner === 'FEEDING' ? 'active' : ''}`} onClick={() => handlePresetChange('FEEDING')}>
              <Target size={12} /> Feed Line (West)
            </button>
            <button className={`pf-preset-btn ${activeCorner === 'WATER' ? 'active' : ''}`} onClick={() => handlePresetChange('WATER')}>
              <Target size={12} /> Water Line (East)
            </button>
            <button className={`pf-preset-btn ${activeCorner === 'ROOSTING' ? 'active' : ''}`} onClick={() => handlePresetChange('ROOSTING')}>
              <Target size={12} /> Roosting Bay
            </button>
            <button className={`pf-preset-btn ${activeCorner === 'ENTRANCE' ? 'active' : ''}`} onClick={() => handlePresetChange('ENTRANCE')}>
              <Target size={12} /> Bio Gate Exit
            </button>
            <button className={`pf-preset-btn ${activeCorner === 'OVERVIEW' ? 'active' : ''}`} onClick={() => handlePresetChange('OVERVIEW')}>
              <Target size={12} /> Full Overview
            </button>
          </div>
        </div>
      </div>

      {/* ── CAMERA GRID & MONITORING CENTER ─────────────────────────────────────── */}
      <div className="pf-section-header">
        <h2 className="pf-section-title">
          <Video size={18} /> Camera Grid & Monitoring Feeds
        </h2>
        <span className="pf-section-tag" style={{ background: '#fef3c7', color: '#b45309' }}>
          Live Stream Preview (Demo Feed)
        </span>
      </div>

      <div className="pf-camera-grid">
        {cameras.map(cam => (
          <div
            key={cam.id}
            className="pf-camera-card"
            onClick={() => { setSelectedCamera(cam); setActiveModal('cameraView'); }}
          >
            <div className="pf-camera-feed">
              <div className="pf-camera-overlay">
                <span className="pf-camera-title-badge">{cam.name}</span>
                {cam.status === 'ONLINE' ? (
                  <span className="pf-camera-rec">
                    <div className="rec-dot" /> LIVE
                  </span>
                ) : (
                  <span className="pf-badge offline">OFFLINE</span>
                )}
              </div>
              <div style={{ textAlign: 'center', color: '#64748b' }}>
                <Eye size={36} opacity={0.6} />
                <div style={{ fontSize: '0.72rem', marginTop: '0.4rem', color: '#94a3b8' }}>Click to Expand Live Surveillance</div>
              </div>
              <div className="pf-camera-timestamp">{time.toLocaleTimeString()} &bull; {cam.fps} FPS</div>
            </div>
            <div className="pf-camera-footer">
              <span className="pf-camera-name">{cam.location}</span>
              <span className="pf-camera-demo-tag">[DEMO FEED]</span>
            </div>
          </div>
        ))}
      </div>


      {/* ── HARDWARE EQUIPMENT CONTROL CENTER ─────────────────────────────────── */}
      <div className="pf-control-panel">
        <div className="pf-control-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={18} /> Shed Equipment Hardware Control Center
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Automated climate controls & manual override toggles
            </span>
          </div>
          <span className="pf-badge warning">[DEMO CONTROL &bull; HARDWARE NOT CONNECTED]</span>
        </div>

        <div className="pf-control-grid">
          {equipment.map(item => (
            <div key={item.id} className="pf-equipment-card">
              <div className="pf-equipment-top">
                <span className="pf-equipment-name">
                  <Wind size={15} /> {item.name}
                </span>
                <span className="pf-badge info">{item.shedName}</span>
              </div>
              <div className="pf-segment-control">
                <button
                  className={`pf-segment-btn ${item.mode === 'AUTO' ? 'active-auto' : ''}`}
                  onClick={() => handleEquipmentToggle(item, 'AUTO')}
                >
                  AUTO
                </button>
                <button
                  className={`pf-segment-btn ${item.mode === 'ON' ? 'active-on' : ''}`}
                  onClick={() => handleEquipmentToggle(item, 'ON')}
                >
                  ON
                </button>
                <button
                  className={`pf-segment-btn ${item.mode === 'OFF' ? 'active-off' : ''}`}
                  onClick={() => handleEquipmentToggle(item, 'OFF')}
                >
                  OFF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CENTRALIZED ALERT CENTER ─────────────────────────────────────────── */}
      <div className="pf-alert-center">
        <div className="pf-control-header">
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={18} /> Centralized Farm Operational Alerts
          </h3>
          <span className="pf-badge critical">{alerts.length} Active Operational Alerts</span>
        </div>

        <div className="pf-alert-list">
          {alerts.map(alt => (
            <div key={alt.id} className={`pf-alert-row ${alt.severity}`}>
              <div className="pf-alert-body">
                <div className="pf-alert-title">
                  {alt.severity === 'critical' ? <AlertOctagon size={16} /> : <AlertCircle size={16} />}
                  [{alt.category}] {alt.title} &bull; <span style={{ textDecoration: 'underline' }}>{alt.shedName}</span>
                </div>
                <div className="pf-alert-meta">
                  {alt.message} &bull; <strong>Recommended Action:</strong> {alt.action} ({alt.timestamp})
                </div>
              </div>
              <button
                className="pf-alert-action-btn"
                onClick={() => {
                  const s = sheds.find(shed => shed.name === alt.shedName);
                  if (s) { setSelectedShed(s); setActiveModal('shedDetail'); }
                }}
              >
                OPEN SHED
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEED, WATER & TODAY'S OPERATIONS ──────────────────────────────────── */}
      <div className="pf-two-col">
        {/* Feed & Water Status */}
        <div className="pf-card">
          <div className="pf-card-title">
            <span><Package size={16} /> Feed & Water Inventory Balance</span>
            <span className="pf-badge healthy">Stock Healthy</span>
          </div>

          <div className="pf-feed-list">
            <div className="pf-feed-item">
              <div>
                <strong>Broiler Starter Crumbs</strong>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Silo 1 &bull; 4,200 kg</div>
              </div>
              <span className="pf-badge normal">Healthy Stock</span>
            </div>
            <div className="pf-feed-item">
              <div>
                <strong>Broiler Finisher Pellets</strong>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Silo 2 &bull; 850 kg</div>
              </div>
              <span className="pf-badge warning">Low (Reorder 1,200 kg)</span>
            </div>
            <div className="pf-feed-item">
              <div>
                <strong>Layer Mash Phase 1</strong>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Storage Room B &bull; 6,800 kg</div>
              </div>
              <span className="pf-badge normal">Healthy Stock</span>
            </div>
          </div>
        </div>

        {/* Today's Operational Tasks Checklist */}
        <div className="pf-card">
          <div className="pf-card-title">
            <span><CheckSquare size={16} /> Today's Farm Operations Task List</span>
            <span className="pf-badge info">{tasks.filter(t => t.completed).length} / {tasks.length} Done</span>
          </div>

          <div className="pf-task-list">
            {tasks.map(task => (
              <div key={task.id} className="pf-task-item">
                <input
                  type="checkbox"
                  className="pf-task-checkbox"
                  checked={task.completed}
                  onChange={() => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
                />
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#94a3b8' : '#0f172a', flex: 1 }}>
                  {task.title}
                </span>
                <span className="pf-badge info">{task.shed}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODALS SECTION ────────────────────────────────────────────────────── */}

      {/* 1. SHED DETAIL DIAGNOSTIC MODAL */}
      {activeModal === 'shedDetail' && selectedShed && (
        <div className="pf-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="pf-modal" onClick={e => e.stopPropagation()}>
            <div className="pf-modal-header">
              <h3 className="pf-modal-title">{selectedShed.name} Diagnostic & Controls</h3>
              <button className="pf-modal-close" onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="pf-flock-grid">
                <div className="pf-flock-item"><span className="pf-flock-label">Batch Code</span><span className="pf-flock-val">{selectedShed.batchCode}</span></div>
                <div className="pf-flock-item"><span className="pf-flock-label">Bird Count</span><span className="pf-flock-val">{selectedShed.birds.toLocaleString('en-IN')}</span></div>
                <div className="pf-flock-item"><span className="pf-flock-label">Age</span><span className="pf-flock-val">{selectedShed.batchAgeDays} Days</span></div>
                <div className="pf-flock-item"><span className="pf-flock-label">Health</span><span className="pf-flock-val">{selectedShed.healthStatus}</span></div>
              </div>
              <div className="pf-env-metrics-grid">
                <div className="pf-env-tile"><span className="pf-env-target">Current Temperature</span><span className="pf-env-value">{selectedShed.temp}°C</span></div>
                <div className="pf-env-tile"><span className="pf-env-target">Current Humidity</span><span className="pf-env-value">{selectedShed.humidity}%</span></div>
                <div className="pf-env-tile"><span className="pf-env-target">Water Line</span><span className="pf-env-value" style={{ fontSize: '1rem' }}>{selectedShed.waterStatus}</span></div>
                <div className="pf-env-tile"><span className="pf-env-target">Feed Supply</span><span className="pf-env-value" style={{ fontSize: '1rem' }}>{selectedShed.feedStatus}</span></div>
              </div>
            </div>
            <div className="pf-modal-footer">
              <button className="pf-btn-secondary" onClick={() => setActiveModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CAMERA EXPANDED LIVE PREVIEW MODAL */}
      {activeModal === 'cameraView' && selectedCamera && (
        <div className="pf-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="pf-modal" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
            <div className="pf-modal-header">
              <h3 className="pf-modal-title">{selectedCamera.name} Surveillance Stream</h3>
              <button className="pf-modal-close" onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <div style={{ height: '360px', background: '#0f172a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(220,38,38,0.9)', color: 'white', padding: '0.3rem 0.7rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div className="rec-dot" /> LIVE SURVEILLANCE FEED &bull; {selectedCamera.location}
              </div>
              <Eye size={64} color="#475569" />
              <div style={{ position: 'absolute', bottom: 12, right: 12, color: '#94a3b8', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                [DEMO PREVIEW] {time.toISOString()}
              </div>
            </div>
            <div className="pf-modal-footer">
              <button className="pf-btn-secondary" onClick={() => setActiveModal(null)}>Close Stream</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SAFETY CONFIRMATION OVERRIDE DIALOG */}
      {safetyOverrideItem && (
        <div className="pf-modal-backdrop" onClick={() => setSafetyOverrideItem(null)}>
          <div className="pf-modal" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="pf-modal-header">
              <h3 className="pf-modal-title" style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertOctagon size={20} /> Confirm Manual Control Action
              </h3>
              <button className="pf-modal-close" onClick={() => setSafetyOverrideItem(null)}><X size={18} /></button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#334155' }}>
              Temperature in <strong>{safetyOverrideItem.item.shedName}</strong> is elevated. Turning <strong>{safetyOverrideItem.item.name}</strong> to <strong>{safetyOverrideItem.targetMode}</strong> may impact bird ventilation.
            </p>
            <div className="pf-modal-footer">
              <button className="pf-btn-secondary" onClick={() => setSafetyOverrideItem(null)}>Cancel</button>
              <button className="pf-btn-primary" style={{ background: '#dc2626' }} onClick={confirmSafetyOverride}>
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. QUICK ACTION: RECORD MORTALITY MODAL */}
      {activeModal === 'mortality' && (
        <div className="pf-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="pf-modal" onClick={e => e.stopPropagation()}>
            <div className="pf-modal-header">
              <h3 className="pf-modal-title">Record Daily Bird Mortality</h3>
              <button className="pf-modal-close" onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleRecordMortality}>
              <div className="pf-form-grid">
                <div className="pf-field">
                  <label className="pf-label">Shed</label>
                  <select className="pf-select" value={mortalityShedId} onChange={e => setMortalityShedId(e.target.value)}>
                    <option value="shed-a">Shed A (BR-2026-004)</option>
                    <option value="shed-b">Shed B (BR-2026-005)</option>
                    <option value="shed-c">Shed C (LY-2025-012)</option>
                  </select>
                </div>
                <div className="pf-field">
                  <label className="pf-label">Bird Count Quantity</label>
                  <input type="number" className="pf-input" placeholder="e.g. 5" value={mortalityQty} onChange={e => setMortalityQty(e.target.value)} required />
                </div>
                <div className="pf-field full">
                  <label className="pf-label">Reason / Diagnosis</label>
                  <input type="text" className="pf-input" placeholder="e.g. Heat stress / Culling" value={mortalityReason} onChange={e => setMortalityReason(e.target.value)} />
                </div>
              </div>
              <div className="pf-modal-footer">
                <button type="button" className="pf-btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="pf-btn-primary">Save Mortality Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. QUICK ACTION: RECORD FEED USAGE MODAL */}
      {activeModal === 'feed' && (
        <div className="pf-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="pf-modal" onClick={e => e.stopPropagation()}>
            <div className="pf-modal-header">
              <h3 className="pf-modal-title">Record Daily Feed Consumption</h3>
              <button className="pf-modal-close" onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleRecordFeed}>
              <div className="pf-form-grid">
                <div className="pf-field">
                  <label className="pf-label">Feed Type</label>
                  <select className="pf-select" value={feedTypeInput} onChange={e => setFeedTypeInput(e.target.value)}>
                    <option value="Broiler Finisher Pellets">Broiler Finisher Pellets</option>
                    <option value="Broiler Starter Crumbs">Broiler Starter Crumbs</option>
                    <option value="Layer Mash Phase 1">Layer Mash Phase 1</option>
                  </select>
                </div>
                <div className="pf-field">
                  <label className="pf-label">Quantity Consumed (kg)</label>
                  <input type="number" className="pf-input" placeholder="e.g. 450" value={feedQtyKg} onChange={e => setFeedQtyKg(e.target.value)} required />
                </div>
              </div>
              <div className="pf-modal-footer">
                <button type="button" className="pf-btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="pf-btn-primary">Save Feed Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. QUICK ACTION: RECORD EGG PRODUCTION MODAL */}
      {activeModal === 'eggs' && (
        <div className="pf-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="pf-modal" onClick={e => e.stopPropagation()}>
            <div className="pf-modal-header">
              <h3 className="pf-modal-title">Record Daily Egg Collection</h3>
              <button className="pf-modal-close" onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleRecordEggProduction}>
              <div className="pf-form-grid">
                <div className="pf-field">
                  <label className="pf-label">Good Quality Eggs</label>
                  <input type="number" className="pf-input" placeholder="e.g. 14200" value={eggGoodQty} onChange={e => setEggGoodQty(e.target.value)} required />
                </div>
                <div className="pf-field">
                  <label className="pf-label">Damaged Eggs</label>
                  <input type="number" className="pf-input" placeholder="e.g. 80" value={eggDamagedQty} onChange={e => setEggDamagedQty(e.target.value)} required />
                </div>
              </div>
              <div className="pf-modal-footer">
                <button type="button" className="pf-btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="pf-btn-primary">Save Egg Production</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

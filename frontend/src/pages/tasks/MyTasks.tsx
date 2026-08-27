import React, { useState } from 'react';
import {
  ListTodo, CheckCircle2, Clock, AlertTriangle, Plus, Search, Filter,
  Calendar, Wrench, ShieldCheck, Package, Factory, CheckSquare, Square,
  Trash2, Play, Check
} from 'lucide-react';
import '../dashboard/dashboard.css';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: 'Maintenance' | 'Quality Control' | 'Inventory' | 'Production' | 'Operations';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  dueDate: string;
  assignedShift: string;
  checklist: ChecklistItem[];
}

const SAMPLE_TASKS: TaskItem[] = [
  {
    id: 'TSK-101',
    title: 'Weaving Machine M-01 Spindle Calibration & Lubrication',
    description: 'Perform scheduled morning maintenance, lubricate main spindle bearings, and verify tension sensor alignment on Loom M-01.',
    category: 'Maintenance',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-08-17 04:00 PM',
    assignedShift: 'Morning Shift (08:00 AM - 04:30 PM)',
    checklist: [
      { id: 'c1', text: 'Power down machine and lock out safety switch', completed: true },
      { id: 'c2', text: 'Clean dust and fiber build-up from spindle assembly', completed: true },
      { id: 'c3', text: 'Apply high-temp lubricant to bearings', completed: true },
      { id: 'c4', text: 'Run 10-min test cycle and log vibration metrics', completed: false }
    ]
  },
  {
    id: 'TSK-102',
    title: 'Cotton Grade A Yarn Quality Inspection for Order WO-102',
    description: 'Pull 5 sample bobbins from Spinning Machine S-01, test tensile strength, and log imperfection count per 1000m.',
    category: 'Quality Control',
    priority: 'High',
    status: 'Pending',
    dueDate: '2026-08-17 02:30 PM',
    assignedShift: 'Morning Shift (08:00 AM - 04:30 PM)',
    checklist: [
      { id: 'c1', text: 'Collect 5 random yarn bobbins from Lot #402', completed: false },
      { id: 'c2', text: 'Run yarn evenness test on Uster tester', completed: false },
      { id: 'c3', text: 'Submit QC inspection report in ERP system', completed: false }
    ]
  },
  {
    id: 'TSK-103',
    title: 'Warehouse B Raw Polyester Stock Count Verification',
    description: 'Verify physical stock count of Polyester Yarn (MAT-003) against ERP system records in Warehouse B Row 4.',
    category: 'Inventory',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '2026-08-18 11:00 AM',
    assignedShift: 'General (09:00 AM - 05:00 PM)',
    checklist: [
      { id: 'c1', text: 'Scan pallet barcodes in Row 4', completed: true },
      { id: 'c2', text: 'Reconcile physical box count with ERP MAT-003 ledger', completed: false }
    ]
  },
  {
    id: 'TSK-104',
    title: 'Dyeing Machine D-01 Thermal Sensor Inspection Log',
    description: 'Inspect temperature probe calibration on Dyeing Vessel D-01 to prevent thermal variance during reactive dye cycles.',
    category: 'Maintenance',
    priority: 'High',
    status: 'Overdue',
    dueDate: '2026-08-16 05:00 PM',
    assignedShift: 'Morning Shift (08:00 AM - 04:30 PM)',
    checklist: [
      { id: 'c1', text: 'Inspect sensor thermocouple probe for corrosion', completed: false },
      { id: 'c2', text: 'Recalibrate digital controller offset to ±0.5°C', completed: false }
    ]
  },
  {
    id: 'TSK-105',
    title: 'Shift Handover Log & Safety Compliance Checklist',
    description: 'Complete end-of-shift machine state handover report and verify all emergency stop buttons are clear.',
    category: 'Operations',
    priority: 'Low',
    status: 'Completed',
    dueDate: '2026-08-17 05:00 PM',
    assignedShift: 'Morning Shift (08:00 AM - 04:30 PM)',
    checklist: [
      { id: 'c1', text: 'Verify all trash containers emptied', completed: true },
      { id: 'c2', text: 'Sign off shift supervisor handover log', completed: true },
      { id: 'c3', text: 'Turn off non-essential workshop lighting', completed: true }
    ]
  },
  {
    id: 'TSK-106',
    title: 'Prepare Denim Fabric Sample Rolls for Customer Inspection',
    description: 'Cut and package 10-meter sample rolls of Heavy Denim Fabric for shipment to Urban Threads Pvt Ltd.',
    category: 'Production',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2026-08-19 03:00 PM',
    assignedShift: 'Day Shift (09:00 AM - 05:30 PM)',
    checklist: [
      { id: 'c1', text: 'Cut 10m roll from Loom Batch #804', completed: true },
      { id: 'c2', text: 'Inspect fabric face for weaving slubs or oil spots', completed: true },
      { id: 'c3', text: 'Attach shipping sample tag with Order SO-301 reference', completed: false }
    ]
  },
  {
    id: 'TSK-107',
    title: 'Weaving Loom Reed & Harness Alignment Check',
    description: 'Inspect reed wire condition and verify harness drop wire sensitivity on Weaving Loom M-02.',
    category: 'Maintenance',
    priority: 'Low',
    status: 'Pending',
    dueDate: '2026-08-20 01:00 PM',
    assignedShift: 'Morning Shift (08:00 AM - 04:30 PM)',
    checklist: [
      { id: 'c1', text: 'Check reed dent pitch with feeler gauge', completed: false },
      { id: 'c2', text: 'Test warp stop motion drop wire electric circuit', completed: false }
    ]
  }
];

export const MyTasks: React.FC = () => {
  const [taskList, setTaskList] = useState<TaskItem[]>(SAMPLE_TASKS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('Production');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('Medium');
  const [newDueDate, setNewDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newChecklistInput, setNewChecklistInput] = useState<string>('');

  // Toggle Checklist Item
  const toggleChecklist = (taskId: string, itemId: string) => {
    setTaskList(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      const updatedChecklist = task.checklist.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item);
      
      // Auto update task status if all checklist items completed
      const allDone = updatedChecklist.length > 0 && updatedChecklist.every(i => i.completed);
      let newStatus = task.status;
      if (allDone && task.status !== 'Completed') {
        newStatus = 'Completed';
      } else if (!allDone && task.status === 'Completed') {
        newStatus = 'In Progress';
      }

      return {
        ...task,
        checklist: updatedChecklist,
        status: newStatus
      };
    }));
  };

  // Update Task Status
  const setTaskStatus = (taskId: string, status: TaskItem['status']) => {
    setTaskList(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  // Delete Task
  const deleteTask = (taskId: string) => {
    setTaskList(prev => prev.filter(t => t.id !== taskId));
  };

  // Add New Task Submit
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const checklistItems = newChecklistInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map((text, idx) => ({ id: `c_${Date.now()}_${idx}`, text, completed: false }));

    const newTask: TaskItem = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      description: newDesc || 'No additional details provided.',
      category: newCategory,
      priority: newPriority,
      status: 'Pending',
      dueDate: newDueDate,
      assignedShift: 'Morning Shift (08:00 AM - 04:30 PM)',
      checklist: checklistItems.length > 0 ? checklistItems : [{ id: 'c_default', text: 'Complete task requirements', completed: false }]
    };

    setTaskList([newTask, ...taskList]);
    setShowModal(false);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewCategory('Production');
    setNewPriority('Medium');
    setNewChecklistInput('');
  };

  // KPI Calculations
  const totalTasks = taskList.length;
  const pendingCount = taskList.filter(t => t.status === 'Pending').length;
  const inProgressCount = taskList.filter(t => t.status === 'In Progress').length;
  const completedCount = taskList.filter(t => t.status === 'Completed').length;
  const overdueCount = taskList.filter(t => t.status === 'Overdue').length;

  // Filter Tasks
  const filteredTasks = taskList.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getPriorityStyle = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'High':
        return { bg: '#fee2e2', color: '#991b1b', label: 'High Priority' };
      case 'Medium':
        return { bg: '#fef3c7', color: '#b45309', label: 'Medium Priority' };
      case 'Low':
        return { bg: '#e0f2fe', color: '#0369a1', label: 'Low Priority' };
    }
  };

  const getStatusBadge = (status: TaskItem['status']) => {
    switch (status) {
      case 'Completed':
        return <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={13} /> Completed</span>;
      case 'In Progress':
        return <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Play size={13} /> In Progress</span>;
      case 'Pending':
        return <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> Pending</span>;
      case 'Overdue':
        return <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={13} /> Overdue</span>;
    }
  };

  const getCategoryIcon = (category: TaskItem['category']) => {
    switch (category) {
      case 'Maintenance': return <Wrench size={14} color="#8b5cf6" />;
      case 'Quality Control': return <ShieldCheck size={14} color="#10b981" />;
      case 'Inventory': return <Package size={14} color="#f59e0b" />;
      case 'Production': return <Factory size={14} color="#0284c7" />;
      case 'Operations': return <ListTodo size={14} color="#64748b" />;
    }
  };

  return (
    <div className="erp-dashboard">
      {/* Header Banner */}
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ListTodo size={28} color="#0284c7" />
            My Tasks & Work Assignments
          </h1>
          <p className="erp-page-subtitle">Track daily production duties, maintenance checklists, and quality assignments</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}>
            <Plus size={18} /> Create New Task
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="erp-panel" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem' }}>
        <div style={{ padding: '1.25rem', borderLeft: '4px solid #0284c7', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Tasks</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{totalTasks}</div>
        </div>

        <div style={{ padding: '1.25rem', borderLeft: '4px solid #64748b', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Pending</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#475569', marginTop: '4px' }}>{pendingCount}</div>
        </div>

        <div style={{ padding: '1.25rem', borderLeft: '4px solid #0ea5e9', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>In Progress</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0369a1', marginTop: '4px' }}>{inProgressCount}</div>
        </div>

        <div style={{ padding: '1.25rem', borderLeft: '4px solid #10b981', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Completed</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#166534', marginTop: '4px' }}>{completedCount}</div>
        </div>

        <div style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Overdue</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#991b1b', marginTop: '4px' }}>{overdueCount}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="erp-panel" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="erp-input"
              placeholder="Search task title, ID or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#64748b" />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>Status:</span>
            <select
              className="erp-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '140px' }}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>Priority:</span>
            <select
              className="erp-input"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ width: '130px' }}
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>Category:</span>
            <select
              className="erp-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="All">All Categories</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Quality Control">Quality Control</option>
              <option value="Inventory">Inventory</option>
              <option value="Production">Production</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.25rem' }}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const pStyle = getPriorityStyle(task.priority);
            const doneChecklist = task.checklist.filter(c => c.completed).length;
            const totalChecklist = task.checklist.length;
            const progressPct = totalChecklist > 0 ? Math.round((doneChecklist / totalChecklist) * 100) : 0;

            return (
              <div key={task.id} className="erp-panel" style={{
                padding: '1.5rem',
                borderLeft: task.status === 'Completed' ? '5px solid #10b981' : (task.status === 'Overdue' ? '5px solid #ef4444' : '5px solid #0284c7'),
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#0284c7', fontSize: '0.85rem' }}>{task.id}</span>
                      
                      <span style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {getCategoryIcon(task.category)} {task.category}
                      </span>

                      <span style={{
                        backgroundColor: pStyle.bg,
                        color: pStyle.color,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {pStyle.label}
                      </span>

                      {getStatusBadge(task.status)}
                    </div>

                    <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>
                      {task.title}
                    </h3>

                    <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
                      {task.description}
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: '#64748b', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: task.status === 'Overdue' ? '#dc2626' : '#64748b', fontWeight: task.status === 'Overdue' ? 700 : 500 }}>
                        <Calendar size={14} /> Due: {task.dueDate}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {task.assignedShift}
                      </span>
                    </div>
                  </div>

                  {/* Checklist & Progress Section */}
                  <div style={{ width: '320px', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                        Task Checklist ({doneChecklist}/{totalChecklist})
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}>{progressPct}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginBottom: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: progressPct === 100 ? '#10b981' : '#0284c7', transition: 'width 0.3s ease' }} />
                    </div>

                    {/* Checklist items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                      {task.checklist.map(item => (
                        <div
                          key={item.id}
                          onClick={() => toggleChecklist(task.id, item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            color: item.completed ? '#94a3b8' : '#334155',
                            textDecoration: item.completed ? 'line-through' : 'none',
                            padding: '4px 0'
                          }}
                        >
                          {item.completed ? <CheckSquare size={16} color="#10b981" /> : <Square size={16} color="#cbd5e1" />}
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Controls */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e2e8f0', justifyContent: 'flex-end' }}>
                      {task.status !== 'In Progress' && task.status !== 'Completed' && (
                        <button
                          className="erp-btn erp-btn-outline"
                          onClick={() => setTaskStatus(task.id, 'In Progress')}
                          style={{ fontSize: '0.75rem', padding: '4px 8px', color: '#0284c7', borderColor: '#bae6fd' }}
                        >
                          <Play size={12} style={{ marginRight: '4px' }} /> Start
                        </button>
                      )}

                      {task.status !== 'Completed' ? (
                        <button
                          className="erp-btn"
                          onClick={() => setTaskStatus(task.id, 'Completed')}
                          style={{ fontSize: '0.75rem', padding: '4px 8px', backgroundColor: '#10b981', color: '#ffffff' }}
                        >
                          <Check size={12} style={{ marginRight: '4px' }} /> Done
                        </button>
                      ) : (
                        <button
                          className="erp-btn erp-btn-outline"
                          onClick={() => setTaskStatus(task.id, 'In Progress')}
                          style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                        >
                          Reopen
                        </button>
                      )}

                      <button
                        className="erp-btn erp-btn-outline"
                        onClick={() => deleteTask(task.id)}
                        style={{ fontSize: '0.75rem', padding: '4px 8px', color: '#ef4444', borderColor: '#fca5a5' }}
                        title="Delete Task"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="erp-panel" style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <ListTodo size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <h3>No tasks found matching your filters</h3>
            <p>Try clearing your search term or filter parameters.</p>
          </div>
        )}
      </div>

      {/* CREATE NEW TASK MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            width: '520px',
            maxWidth: '92%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.4rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={22} color="#0284c7" /> Create New Work Assignment Task
            </h2>

            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Task Title *</label>
                <input
                  type="text"
                  className="erp-input"
                  placeholder="e.g. Inspect Spinning Loom S-02 Tension Assembly"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Category</label>
                  <select
                    className="erp-input"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    style={{ width: '100%' }}
                  >
                    <option value="Production">Production</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Priority</label>
                  <select
                    className="erp-input"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    style={{ width: '100%' }}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Due Date</label>
                <input
                  type="date"
                  className="erp-input"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Task Description</label>
                <textarea
                  className="erp-input"
                  rows={3}
                  placeholder="Provide instructions and steps..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                  Checklist Items (Enter one item per line)
                </label>
                <textarea
                  className="erp-input"
                  rows={3}
                  placeholder="Inspect power connections&#10;Clean dust filter&#10;Log meter reading"
                  value={newChecklistInput}
                  onChange={(e) => setNewChecklistInput(e.target.value)}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="erp-btn erp-btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="erp-btn erp-btn-primary">
                  Save & Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

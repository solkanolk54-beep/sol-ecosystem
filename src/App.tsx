/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { MobileDeviceSimulator } from './components/MobileDeviceSimulator';
import { CodeHubView } from './components/CodeHubView';
import { AiScannerModal } from './components/AiScannerModal';
import { TreeDetailModal } from './components/TreeDetailModal';
import { AnimalDetailModal } from './components/AnimalDetailModal';
import { TraceabilityModal } from './components/TraceabilityModal';
import { ToastContainer, playNotificationSound } from './components/ToastContainer';
import { PredictiveIrrigationView } from './components/PredictiveIrrigationView';
import {
  INITIAL_FARM,
  INITIAL_TREES,
  INITIAL_LIVESTOCK,
  INITIAL_BATCHES
} from './data/mockData';
import { Farm, Tree, LivestockAnimal, TraceabilityBatch, ToastNotificationItem } from './types';

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<
    'mobile_simulator' | 'full_dashboard' | 'predictive_irrigation' | 'step1_sql' | 'step2_express' | 'step3_flutter'
  >('mobile_simulator');

  // Application Data State
  const [farm] = useState<Farm>(INITIAL_FARM);
  const [trees, setTrees] = useState<Tree[]>(INITIAL_TREES);
  const [livestock, setLivestock] = useState<LivestockAnimal[]>(INITIAL_LIVESTOCK);
  const [batches] = useState<TraceabilityBatch[]>(INITIAL_BATCHES);

  // Modals & Drawers
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<LivestockAnimal | null>(null);
  const [isAiScannerOpen, setIsAiScannerOpen] = useState<boolean>(false);
  const [isTraceabilityOpen, setIsTraceabilityOpen] = useState<boolean>(false);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastNotificationItem[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<ToastNotificationItem[]>([]);

  // Add toast helper
  const addToast = useCallback((toastData: Omit<ToastNotificationItem, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const timestamp = new Date().toLocaleTimeString('ar-DZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const newToast: ToastNotificationItem = {
      ...toastData,
      id,
      timestamp,
    };

    playNotificationSound(newToast.type);

    setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep max 4 visible
    setNotificationHistory((prev) => [newToast, ...prev]);
  }, []);

  // Dismiss toast helper
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handler: Trigger Diseased Tree Alert
  const triggerTreeAlert = useCallback((customTree?: Tree) => {
    const diseased = customTree || trees.find((t) => t.healthStatus === 'diseased') || trees[2];
    const diseaseName = diseased.diseaseHistory[0]?.condition || 'عفن ثمار الأنثراكنوز (Colletotrichum)';

    addToast({
      type: 'danger',
      category: 'tree',
      title: '🚨 إنذار زراعي: اكتشاف شجرة مصابة!',
      message: `تم رصد الشجرة ${diseased.tagCode} (${diseased.variety}) في ${diseased.parcelZone} بحالة 'مصابة' بـ (${diseaseName}) - تتطلب عزلاً ورشاً بيولوجياً فورياً.`,
      actionLabel: 'معاينة الشجرة',
      onAction: () => setSelectedTree(diseased),
      metadata: { treeId: diseased.id, tagCode: diseased.tagCode },
    });
  }, [trees, addToast]);

  // Handler: Trigger Upcoming Livestock Vaccination Alert
  const triggerLivestockAlert = useCallback((customAnimal?: LivestockAnimal) => {
    const animal =
      customAnimal ||
      livestock.find((a) => a.vaccinationSchedule.some((v) => v.status === 'upcoming')) ||
      livestock[0];
    const upcomingVac =
      animal.vaccinationSchedule.find((v) => v.status === 'upcoming') ||
      animal.vaccinationSchedule[0];

    addToast({
      type: 'warning',
      category: 'livestock',
      title: '💉 تنبيه بيطري: موعد تطعيم قادم',
      message: `اقترب موعد الجرعة المعززة (${upcomingVac.vaccine}) لـ ${animal.nameOrAlias} (${animal.tagRfid}) المبرمجة بتاريخ ${upcomingVac.date}.`,
      actionLabel: 'فتح السجل البيطري',
      onAction: () => setSelectedAnimal(animal),
      metadata: { animalId: animal.id, tagRfid: animal.tagRfid },
    });
  }, [livestock, addToast]);

  // Initial Load: Automatically alert user once of diseased tree and upcoming vaccination
  const initialAlertsSentRef = useRef(false);
  useEffect(() => {
    if (initialAlertsSentRef.current) return;
    initialAlertsSentRef.current = true;

    // 1. Initial Tree alert after 900ms
    const timer1 = setTimeout(() => {
      triggerTreeAlert();
    }, 900);

    // 2. Upcoming Vaccination alert after 2800ms
    const timer2 = setTimeout(() => {
      triggerLivestockAlert();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [triggerTreeAlert, triggerLivestockAlert]);

  // Agronomic Mutation: Log AI Diagnosis treatment into tree file
  const handleAddTreatmentLog = (treeId: string, condition: string, treatment: string) => {
    let affectedTree: Tree | undefined;

    setTrees((prevTrees) =>
      prevTrees.map((t) => {
        if (t.id === treeId) {
          const isDiseased =
            condition.toLowerCase().includes('peacock') ||
            condition.toLowerCase().includes('anthracnose') ||
            condition.includes('عين الطاووس') ||
            condition.includes('أنثراكنوز');

          const updated: Tree = {
            ...t,
            healthStatus: isDiseased ? 'diseased' : t.healthStatus,
            diseaseHistory: [
              {
                date: new Date().toISOString().split('T')[0],
                condition,
                treatment,
                status: 'in_progress',
              },
              ...t.diseaseHistory,
            ],
          };
          affectedTree = updated;
          return updated;
        }
        return t;
      })
    );

    // Trigger Toast Notification on condition logged
    setTimeout(() => {
      const tag = affectedTree?.tagCode || 'SOL-TR';
      addToast({
        type: 'danger',
        category: 'tree',
        title: '🚨 إنذار فحص الذكاء الاصطناعي: حالة مصابة مسجلة',
        message: `تم تحديث السجل الزراعي للشجرة ${tag}: تسجيل حالة (${condition}) وتفعيل بروتوكول العلاج.`,
        actionLabel: 'معاينة الشجرة',
        onAction: () => {
          if (affectedTree) setSelectedTree(affectedTree);
        },
      });
    }, 200);
  };

  // Agronomic Mutation: Toggle Irrigation
  const handleToggleIrrigation = (treeId: string) => {
    let modifiedTree: Tree | undefined;

    setTrees((prevTrees) =>
      prevTrees.map((t) => {
        if (t.id === treeId) {
          const isDeficit = t.irrigationStatus === 'deficit';
          const updated: Tree = {
            ...t,
            irrigationStatus: isDeficit ? 'optimal' : 'scheduled',
            soilMoisturePct: isDeficit ? +(t.soilMoisturePct + 12).toFixed(1) : t.soilMoisturePct,
            healthStatus: isDeficit ? 'healthy' : t.healthStatus,
          };
          modifiedTree = updated;
          return updated;
        }
        return t;
      })
    );

    // Refresh active tree modal if open
    setSelectedTree((current) => {
      if (current && current.id === treeId) {
        const isDeficit = current.irrigationStatus === 'deficit';
        return {
          ...current,
          irrigationStatus: isDeficit ? 'optimal' : 'scheduled',
          soilMoisturePct: isDeficit ? +(current.soilMoisturePct + 12).toFixed(1) : current.soilMoisturePct,
          healthStatus: isDeficit ? 'healthy' : current.healthStatus,
        };
      }
      return current;
    });

    if (modifiedTree) {
      addToast({
        type: 'success',
        category: 'tree',
        title: '💧 تحديث شبكة الري بالتقطير',
        message: `تم تشغيل دورة الري للشجرة ${modifiedTree.tagCode} (${modifiedTree.variety}). نسبة الرطوبة الآن ${modifiedTree.soilMoisturePct}%.`,
      });
    }
  };

  // Agronomic Mutation: Execute Parcel Predictive Irrigation
  const handleIrrigateParcel = (parcelId: string, treeIds: string[]) => {
    setTrees((prevTrees) =>
      prevTrees.map((t) => {
        // If treeId is in this parcel or belongs to zone
        const matchesZone =
          treeIds.includes(t.id) ||
          (parcelId === 'parcel-beta' && t.parcelZone.includes('Beta')) ||
          (parcelId === 'parcel-alpha' && t.parcelZone.includes('Alpha')) ||
          (parcelId === 'parcel-gamma' && t.parcelZone.includes('Gamma')) ||
          (parcelId === 'parcel-citrus' && t.parcelZone.includes('Citrus')) ||
          (parcelId === 'parcel-fig' && t.parcelZone.includes('Fig'));

        if (matchesZone) {
          return {
            ...t,
            soilMoisturePct: +(Math.min(43.5, t.soilMoisturePct + 15.0)).toFixed(1),
            irrigationStatus: 'optimal',
            healthStatus: t.healthStatus === 'needs_attention' ? 'healthy' : t.healthStatus
          };
        }
        return t;
      })
    );
  };

  // Livestock Mutation: Log new weight
  const handleLogWeight = (animalId: string, newWeight: number) => {
    let updatedAnimal: LivestockAnimal | undefined;

    setLivestock((prevList) =>
      prevList.map((a) => {
        if (a.id === animalId) {
          const updated: LivestockAnimal = {
            ...a,
            currentWeightKg: newWeight,
            weightHistory: [
              ...a.weightHistory,
              { date: new Date().toISOString().split('T')[0], weightKg: newWeight },
            ],
          };
          updatedAnimal = updated;
          return updated;
        }
        return a;
      })
    );

    // Refresh active animal modal if open
    setSelectedAnimal((current) => {
      if (current && current.id === animalId) {
        return {
          ...current,
          currentWeightKg: newWeight,
          weightHistory: [
            ...current.weightHistory,
            { date: new Date().toISOString().split('T')[0], weightKg: newWeight },
          ],
        };
      }
      return current;
    });

    if (updatedAnimal) {
      addToast({
        type: 'success',
        category: 'livestock',
        title: '⚖️ تسجيل قياس بيومتري جديد',
        message: `تم تحديث وزن ${updatedAnimal.nameOrAlias} (${updatedAnimal.tagRfid}) إلى ${newWeight} كغ في السجل الرقمي.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F4] flex flex-col font-sans text-stone-900 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Toast Notification Container (RTL Floating Alerts) */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Application Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiScanner={() => setIsAiScannerOpen(true)}
        activeAlertCount={toasts.length > 0 ? toasts.length : 2}
        recentAlerts={notificationHistory}
        onTriggerTreeAlert={() => triggerTreeAlert()}
        onTriggerLivestockAlert={() => triggerLivestockAlert()}
        onSelectTreeById={(treeId) => {
          const found = trees.find((t) => t.id === treeId);
          if (found) setSelectedTree(found);
        }}
        onSelectAnimalById={(animalId) => {
          const found = livestock.find((a) => a.id === animalId);
          if (found) setSelectedAnimal(found);
        }}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'mobile_simulator' && (
          <MobileDeviceSimulator
            farm={farm}
            trees={trees}
            livestock={livestock}
            batches={batches}
            onSelectTree={(tree) => setSelectedTree(tree)}
            onSelectAnimal={(animal) => setSelectedAnimal(animal)}
            onOpenAiScanner={() => setIsAiScannerOpen(true)}
            onOpenTraceability={() => setIsTraceabilityOpen(true)}
            onTriggerTreeAlert={() => triggerTreeAlert()}
            onTriggerLivestockAlert={() => triggerLivestockAlert()}
            activeAlert={toasts[0] || null}
            onDismissAlert={dismissToast}
            onNavigateToPredictiveIrrigation={() => setActiveTab('predictive_irrigation')}
          />
        )}

        {activeTab === 'full_dashboard' && (
          <DashboardView
            farm={farm}
            trees={trees}
            livestock={livestock}
            batches={batches}
            onSelectTree={(tree) => setSelectedTree(tree)}
            onSelectAnimal={(animal) => setSelectedAnimal(animal)}
            onOpenAiScanner={() => setIsAiScannerOpen(true)}
            onOpenTraceability={() => setIsTraceabilityOpen(true)}
            isMobileSimulator={false}
            onTriggerTreeAlert={() => triggerTreeAlert()}
            onTriggerLivestockAlert={() => triggerLivestockAlert()}
            onNavigateToPredictiveIrrigation={() => setActiveTab('predictive_irrigation')}
          />
        )}

        {activeTab === 'predictive_irrigation' && (
          <PredictiveIrrigationView
            farm={farm}
            trees={trees}
            onIrrigateParcel={handleIrrigateParcel}
            onSelectTree={(tree) => setSelectedTree(tree)}
            onOpenAiScanner={() => setIsAiScannerOpen(true)}
            onShowToast={(title, message, type) => {
              addToast({
                type,
                category: 'tree',
                title,
                message,
              });
            }}
          />
        )}

        {activeTab === 'step1_sql' && <CodeHubView initialTab="step1" />}
        {activeTab === 'step2_express' && <CodeHubView initialTab="step2" />}
        {activeTab === 'step3_flutter' && <CodeHubView initialTab="step3" />}
      </main>

      {/* Modal: AI Vision Diagnostic Camera Preview */}
      <AiScannerModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
        trees={trees}
        onAddTreatmentLog={handleAddTreatmentLog}
      />

      {/* Modal: Individual Tree Dossier (Module A) */}
      <TreeDetailModal
        tree={selectedTree}
        onClose={() => setSelectedTree(null)}
        onToggleIrrigation={handleToggleIrrigation}
      />

      {/* Modal: Individual Livestock Dossier (Module B) */}
      <AnimalDetailModal
        animal={selectedAnimal}
        onClose={() => setSelectedAnimal(null)}
        onLogWeight={handleLogWeight}
      />

      {/* Modal: Batch QR Generator & Public Passport (Module C) */}
      <TraceabilityModal
        isOpen={isTraceabilityOpen}
        onClose={() => setIsTraceabilityOpen(false)}
        batches={batches}
      />
    </div>
  );
}

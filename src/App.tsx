/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { MobileDeviceSimulator } from './components/MobileDeviceSimulator';
import { CodeHubView } from './components/CodeHubView';
import { AiScannerModal } from './components/AiScannerModal';
import { TreeDetailModal } from './components/TreeDetailModal';
import { AnimalDetailModal } from './components/AnimalDetailModal';
import { TraceabilityModal } from './components/TraceabilityModal';
import {
  INITIAL_FARM,
  INITIAL_TREES,
  INITIAL_LIVESTOCK,
  INITIAL_BATCHES
} from './data/mockData';
import { Farm, Tree, LivestockAnimal, TraceabilityBatch } from './types';

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<
    'mobile_simulator' | 'full_dashboard' | 'step1_sql' | 'step2_express' | 'step3_flutter'
  >('mobile_simulator');

  // Application Data State
  const [farm, setFarm] = useState<Farm>(INITIAL_FARM);
  const [trees, setTrees] = useState<Tree[]>(INITIAL_TREES);
  const [livestock, setLivestock] = useState<LivestockAnimal[]>(INITIAL_LIVESTOCK);
  const [batches] = useState<TraceabilityBatch[]>(INITIAL_BATCHES);

  // Modals & Drawers
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<LivestockAnimal | null>(null);
  const [isAiScannerOpen, setIsAiScannerOpen] = useState<boolean>(false);
  const [isTraceabilityOpen, setIsTraceabilityOpen] = useState<boolean>(false);

  // Agronomic Mutation: Log AI Diagnosis treatment into tree file
  const handleAddTreatmentLog = (treeId: string, condition: string, treatment: string) => {
    setTrees((prevTrees) =>
      prevTrees.map((t) => {
        if (t.id === treeId) {
          const isDiseased = condition.toLowerCase().includes('peacock') || condition.toLowerCase().includes('anthracnose');
          return {
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
        }
        return t;
      })
    );
  };

  // Agronomic Mutation: Toggle Irrigation
  const handleToggleIrrigation = (treeId: string) => {
    setTrees((prevTrees) =>
      prevTrees.map((t) => {
        if (t.id === treeId) {
          const isDeficit = t.irrigationStatus === 'deficit';
          return {
            ...t,
            irrigationStatus: isDeficit ? 'optimal' : 'scheduled',
            soilMoisturePct: isDeficit ? +(t.soilMoisturePct + 12).toFixed(1) : t.soilMoisturePct,
            healthStatus: isDeficit ? 'healthy' : t.healthStatus,
          };
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
  };

  // Livestock Mutation: Log new weight
  const handleLogWeight = (animalId: string, newWeight: number) => {
    setLivestock((prevList) =>
      prevList.map((a) => {
        if (a.id === animalId) {
          return {
            ...a,
            currentWeightKg: newWeight,
            weightHistory: [
              ...a.weightHistory,
              { date: new Date().toISOString().split('T')[0], weightKg: newWeight },
            ],
          };
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
  };

  return (
    <div className="min-h-screen bg-[#F4F7F4] flex flex-col font-sans text-stone-900 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Application Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiScanner={() => setIsAiScannerOpen(true)}
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

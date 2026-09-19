'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function GarageFinder({ garageModels = {} }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { deliveryLocation, showToast } = useCart();

  const [vehicleType, setVehicleType] = useState('Motorcycle');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [garageMessage, setGarageMessage] = useState('');

  // Default models fallback if API models object is loading or empty
  const defaultModels = {
    Hero: ['Splendor Plus', 'HF Deluxe', 'Xtreme 160R', 'Xpulse 200'],
    Honda: ['Activa 6G', 'Shine 125', 'Unicorn', 'Dio'],
    TVS: ['Apache RTR 160', 'Jupiter', 'NTorq 125', 'Raider'],
    Bajaj: ['Pulsar 150', 'Pulsar NS200', 'Avenger 220', 'Chetak'],
    'Royal Enfield': ['Classic 350', 'Bullet 350', 'Hunter 350', 'Himalayan'],
    Yamaha: ['FZ-S', 'R15 V4', 'MT-15', 'Fascino'],
    Suzuki: ['Access 125', 'Gixxer', 'Burgman Street', 'Avenis'],
    KTM: ['Duke 200', 'Duke 390', 'RC 200', 'Adventure 390']
  };

  const modelMap = Object.keys(garageModels).length > 0 ? garageModels : defaultModels;
  const currentModelList = selectedBrand ? modelMap[selectedBrand] || [] : [];

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setSelectedModel('');
  };

  const handleGarageSubmit = (e) => {
    e.preventDefault();
    if (!selectedBrand || !selectedModel) {
      showToast('Please choose your vehicle brand and model');
      return;
    }

    const garageData = {
      type: vehicleType,
      brand: selectedBrand,
      model: selectedModel,
      pin: deliveryLocation
    };

    try {
      localStorage.setItem('motomart-garage', JSON.stringify(garageData));
    } catch (err) {}

    setGarageMessage(`✓ Garage saved: ${selectedBrand} ${selectedModel}. Showing compatible essentials.`);
    showToast(`Compatible parts loaded for ${selectedBrand} ${selectedModel}`);

    // Navigate to search with vehicle model query
    router.push(`/search?q=${encodeURIComponent(selectedBrand + ' ' + selectedModel)}`);
  };

  return (
    <section className="garage-card page-shell" id="garage">
      <div className="garage-heading">
        <span className="garage-icon">🏍</span>
        <div>
          <small>{t('YOUR GARAGE')}</small>
          <h2>{t('Find parts that fit your vehicle')}</h2>
        </div>
      </div>

      <form id="garageForm" className="garage-form" onSubmit={handleGarageSubmit}>
        <label>
          <span>{t('Vehicle type')}</span>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
            <option>{t('Motorcycle')}</option>
            <option>{t('Scooter')}</option>
          </select>
        </label>

        <label>
          <span>{t('Brand')}</span>
          <select value={selectedBrand} onChange={handleBrandChange}>
            <option value="">{t('Choose brand')}</option>
            <option>Hero</option>
            <option>Honda</option>
            <option>TVS</option>
            <option>Bajaj</option>
            <option>Royal Enfield</option>
            <option>Yamaha</option>
            <option>Suzuki</option>
            <option>KTM</option>
          </select>
        </label>

        <label>
          <span>{t('Model')}</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">{t('Choose model')}</option>
            {currentModelList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">{t('Find compatible parts')}</button>
      </form>

      {garageMessage && (
        <p className="garage-result" id="garageResult" aria-live="polite">
          {garageMessage}
        </p>
      )}
    </section>
  );
}

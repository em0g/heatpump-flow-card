// Runs the card's auto-detection (getStubConfig) against real Husdata H66 entities.
// node --test test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Minimal browser stubs so the card file can be evaluated in Node.
const registry = new Map();
globalThis.HTMLElement = class {};
globalThis.customElements = { get: (n) => registry.get(n), define: (n, c) => registry.set(n, c) };
globalThis.window = globalThis;
globalThis.document = { querySelector: () => null };
const quiet = console.info;
console.info = () => {};
new Function(readFileSync(new URL('../dist/heatpump-flow-card.js', import.meta.url), 'utf8'))();
console.info = quiet;
const Card = registry.get('heatpump-flow-card');

function hassFrom(file) {
  const { entities } = JSON.parse(readFileSync(new URL(file, import.meta.url), 'utf8'));
  const states = {};
  for (const [id, name, state, unit, extra] of entities) {
    states[id] = {
      entity_id: id,
      state,
      attributes: { friendly_name: name, ...(unit ? { unit_of_measurement: unit } : {}), ...(extra || {}) },
    };
  }
  return { states, language: 'sv' };
}

test('detects every part of a Husdata H66 / IVT Rego 2000-3000 setup', () => {
  const { entities } = Card.getStubConfig(hassFrom('./fixtures/husdata-h66-rego3000.json'));
  assert.deepEqual(entities, {
    outdoor: 'sensor.hp_h66outdoor',
    indoor: 'sensor.hp_h66indoor',
    brine_in: 'sensor.hp_h66brine_in_evaporator',
    brine_out: 'sensor.hp_h66brine_out_condenser',
    heat_carrier_return: 'sensor.hp_h66heat_carrier_return',
    heat_carrier_supply: 'sensor.hp_h66heat_carrier_forwrd',
    radiator_supply: 'sensor.hp_h66radiator_forward',
    hot_water: 'sensor.hp_h66warm_water_1_top',
    hot_water_mid: 'sensor.hp_h66warm_water_2_mid',
    hot_gas: 'sensor.hp_h66hot_gas',
    suction_gas: 'sensor.hp_h66suction_gas',
    compressor_temp: 'sensor.hp_h66compressor',
    compressor_speed: 'sensor.hp_h66compressor_speed',
    heat_output: 'sensor.hp_h66compressor_power',
    brine_pump_speed: 'sensor.hp_h66brine_pump_speed',
    circ_pump_speed: 'sensor.hp_h66circ_pump_speed',
    compressor_hours: 'sensor.hp_h66compr_runtime',
    compressor_starts: 'sensor.hp_h66compr_starts',
    energy_supplied: 'sensor.hp_h66supp_energy_tot',
    energy_consumed: 'sensor.hp_h66compr_consump_tot',
    energy_aux: 'sensor.hp_h66aux_consumption_tot',
    alarm_code: 'sensor.hp_h66alarm_code',
    compressor: 'binary_sensor.hp_h66compressor',
    brine_pump: 'binary_sensor.hp_h66pump_cold_circuit',
    heat_carrier_pump: 'binary_sensor.hp_h66pump_heat_circuit',
    radiator_pump: 'binary_sensor.hp_h66pump_radiator',
    switch_valve: 'binary_sensor.hp_h66switch_valve_1',
    aux_heater: 'sensor.hp_h66add_heat_status',
    alarm: 'binary_sensor.hp_h66alarm',
    heating_setpoint: 'sensor.hp_h66heating_setpoint',
    hot_water_setpoint: 'sensor.hp_h66warm_water_setpoint',
    room_setpoint: 'climate.hp_h66room_temp_setpoint',
  });
});

test('register numbers in entity ids are matched as whole tokens', () => {
  const states = {};
  const add = (id, unit) => { states[id] = { entity_id: id, state: '1', attributes: { friendly_name: 'x', unit_of_measurement: unit } }; };
  add('sensor.h66_0007', '°C');
  add('sensor.other_10007', '°C');
  add('binary_sensor.h66_1a01');
  const { entities } = Card.getStubConfig({ states, language: 'en' });
  assert.equal(entities.outdoor, 'sensor.h66_0007');
  assert.equal(entities.compressor, 'binary_sensor.h66_1a01');
});

/*!
 * Heat Pump Flow Card – an animated heat pump schematic for Home Assistant.
 * Works with any heat pump (ground source or air/water) as long as you have
 * entities for the different parts. Built with Husdata H60/H66 in mind.
 * License: MIT
 */
(() => {
  'use strict';

  const VERSION = '1.0.0';
  const TAG = 'heatpump-flow-card';
  if (customElements.get(TAG)) return;

  /* ------------------------------------------------------------------ */
  /* Texts                                                               */
  /* ------------------------------------------------------------------ */
  const I18N = {
    sv: {
      heat_pump: 'Värmepump',
      outdoor: 'Ute', indoor: 'Inne',
      brine_in: 'Köldbärare in', brine_out: 'Köldbärare ut',
      air_in: 'Utedel in', air_out: 'Utedel ut',
      heat_carrier_supply: 'Värmebärare fram', heat_carrier_return: 'Värmebärare retur',
      radiator_supply: 'Framledning', radiator_return: 'Returledning',
      hot_water: 'Varmvatten', hot_water_mid: 'Varmvatten mitt', hot_gas: 'Hetgas', suction_gas: 'Suggas',
      compressor_temp: 'Kompressortemp', compressor_speed: 'Varvtal', heat_output: 'Värmeeffekt',
      energy_supplied: 'Avgiven energi', energy_consumed: 'Förbrukad energi', energy_aux: 'Energi tillsats',
      compressor_starts: 'Kompressorstarter', scop: 'SCOP totalt', cop: 'COP just nu',
      hours_per_start: 'Drifttid per start',
      compressor: 'Kompressor', brine_pump: 'Köldbärarpump', heat_carrier_pump: 'Värmebärarpump',
      radiator_pump: 'Radiatorpump', switch_valve: 'Växelventil',
      aux_heater: 'Tillsats', aux_step_1: 'Tillsats steg 1', aux_step_2: 'Tillsats steg 2',
      alarm: 'Larm', alarm_code: 'Larmkod',
      heating_setpoint: 'Börvärde värme', hot_water_setpoint: 'Börvärde varmvatten',
      room_setpoint: 'Rumsbörvärde', power: 'Effekt', energy: 'Energi',
      compressor_hours: 'Drifttid kompressor', brine_pump_speed: 'Köldbärarpump varvtal',
      circ_pump_speed: 'Cirk.pump varvtal',
      evaporator: 'Förångare', condenser: 'Kondensor', expansion_valve: 'Exp.ventil',
      borehole: 'Borrhål', outdoor_unit: 'Utedel', mid: 'mitt',
      mode_heating: 'Värmedrift', mode_hot_water: 'Varmvatten', mode_aux: 'Endast tillsats',
      mode_standby: 'Vila', on: 'På', off: 'Av', no_alarm: 'Inga larm', steps: 'Steg',
      delta_brine: 'ΔT köldbärare', delta_heat_carrier: 'ΔT värmebärare', delta_radiator: 'ΔT radiator',
      // editor
      title: 'Rubrik', name: 'Namn på värmepumpen', source: 'Värmekälla',
      src_ground: 'Berg / mark (bergvärme)', src_air: 'Luft (luft/vatten)',
      sec_temps: 'Temperaturer', sec_ops: 'Drift, pumpar & tillsats', sec_more: 'Börvärden & energi',
      sec_look: 'Utseende & beteende',
      animations: 'Animationer', show_labels: 'Visa komponentnamn', show_details: 'Visa detaljrutor',
      aux_heater_max_kw: 'Tillsatsens maxeffekt (kW)', invert_switch_valve: 'Invertera växelventil',
      decimals: 'Antal decimaler',
      h_switch_valve: 'På/1 = varmvatten, Av/0 = värme',
      h_aux_heater: 'Procent (0–100), kW/W eller på/av',
      h_power: 'Valfri elmätare för värmepumpen (W eller kW)',
    },
    en: {
      heat_pump: 'Heat pump',
      outdoor: 'Outdoor', indoor: 'Indoor',
      brine_in: 'Brine in', brine_out: 'Brine out',
      air_in: 'Outdoor unit in', air_out: 'Outdoor unit out',
      heat_carrier_supply: 'Heat carrier supply', heat_carrier_return: 'Heat carrier return',
      radiator_supply: 'Supply', radiator_return: 'Return',
      hot_water: 'Hot water', hot_water_mid: 'Hot water mid', hot_gas: 'Hot gas', suction_gas: 'Suction gas',
      compressor_temp: 'Compressor temp', compressor_speed: 'Speed', heat_output: 'Heat output',
      energy_supplied: 'Energy supplied', energy_consumed: 'Energy consumed', energy_aux: 'Aux energy',
      compressor_starts: 'Compressor starts', scop: 'SCOP total', cop: 'COP now',
      hours_per_start: 'Runtime per start',
      compressor: 'Compressor', brine_pump: 'Brine pump', heat_carrier_pump: 'Heat carrier pump',
      radiator_pump: 'Radiator pump', switch_valve: 'Switch valve',
      aux_heater: 'Aux heater', aux_step_1: 'Aux step 1', aux_step_2: 'Aux step 2',
      alarm: 'Alarm', alarm_code: 'Alarm code',
      heating_setpoint: 'Heating setpoint', hot_water_setpoint: 'Hot water setpoint',
      room_setpoint: 'Room setpoint', power: 'Power', energy: 'Energy',
      compressor_hours: 'Compressor runtime', brine_pump_speed: 'Brine pump speed',
      circ_pump_speed: 'Circ. pump speed',
      evaporator: 'Evaporator', condenser: 'Condenser', expansion_valve: 'Exp. valve',
      borehole: 'Borehole', outdoor_unit: 'Outdoor unit', mid: 'mid',
      mode_heating: 'Heating', mode_hot_water: 'Hot water', mode_aux: 'Aux heat only',
      mode_standby: 'Standby', on: 'On', off: 'Off', no_alarm: 'No alarms', steps: 'Step',
      delta_brine: 'ΔT brine', delta_heat_carrier: 'ΔT heat carrier', delta_radiator: 'ΔT radiator',
      title: 'Title', name: 'Heat pump name', source: 'Heat source',
      src_ground: 'Ground / rock (brine)', src_air: 'Air (air/water)',
      sec_temps: 'Temperatures', sec_ops: 'Operation, pumps & aux heat', sec_more: 'Setpoints & energy',
      sec_look: 'Look & behaviour',
      animations: 'Animations', show_labels: 'Show component names', show_details: 'Show detail tiles',
      aux_heater_max_kw: 'Aux heater max power (kW)', invert_switch_valve: 'Invert switch valve',
      decimals: 'Decimals',
      h_switch_valve: 'On/1 = hot water, Off/0 = heating',
      h_aux_heater: 'Percent (0–100), kW/W or on/off',
      h_power: 'Optional energy meter for the heat pump (W or kW)',
    },
  };

  const TEMP_KEYS = ['outdoor', 'indoor', 'brine_in', 'brine_out', 'heat_carrier_supply',
    'heat_carrier_return', 'radiator_supply', 'radiator_return', 'hot_water', 'hot_water_mid', 'hot_gas',
    'suction_gas'];
  const MORE_KEYS = ['compressor_speed', 'heat_output', 'power', 'compressor_temp', 'heating_setpoint',
    'hot_water_setpoint', 'room_setpoint', 'energy', 'energy_supplied', 'energy_consumed', 'energy_aux',
    'compressor_hours', 'compressor_starts', 'brine_pump_speed', 'circ_pump_speed'];
  // Shown as tiles under the schematic (speed and heat output are drawn in the cabinet instead).
  const TILE_KEYS = ['compressor_temp', 'heating_setpoint', 'hot_water_setpoint', 'room_setpoint', 'power',
    'energy', 'energy_supplied', 'energy_consumed', 'energy_aux', 'compressor_hours', 'compressor_starts',
    'brine_pump_speed', 'circ_pump_speed'];

  /* Best-effort auto detection, used when the card is added from the card picker.
     Matches Husdata register numbers as well as common English/Swedish names. */
  // [name pattern, Husdata register]. Registers are matched as a separate token, e.g. "sensor.h66_0007".
  const DETECT_RAW = {
    outdoor: ['outdoor(?!.*offset)|utomhus|utetemp', '0007'],
    indoor: ['indoor(?!.*(2|set))|inomhus|innetemp', '0008'],
    brine_in: ['brine.?in|koldbarare.?in', '0005'],
    brine_out: ['brine.?out|koldbarare.?ut', '0006'],
    heat_carrier_return: ['heat.?carrier.?ret', '0003'],
    heat_carrier_supply: ['heat.?carrier.?(forw|supp)', '0004'],
    radiator_return: ['rad(iator)?.?return', '0001'],
    radiator_supply: ['rad(iator)?.?(forw|supply)(?!.*2)|framledning', '0002'],
    hot_water: ['(warm|hot).?water.?(1|top)|varmvatten(?!.*(bor|set))', '0009'],
    hot_water_mid: ['(warm|hot).?water.?(2|mid)', '000a'],
    hot_gas: ['hot.?gas|hetgas', '000b'],
    suction_gas: ['suction.?gas|suggas', '000c'],
    // "Compressor" (0014) is a temperature sensor; the on/off one (1A01) is a binary_sensor.
    compressor_temp: ['compressor.?temp|^sensor[.][^ ]*compressor ', '0014'],
    compressor_speed: ['compressor.?speed|kompressor.?varvtal', '3108'],
    heat_output: ['compressor.?power(?!.*draw)|heat.?output|varmeeffekt', '9112'],
    brine_pump_speed: ['brine.?pump.?speed', '3110'],
    circ_pump_speed: ['circ.?pump.?speed', '3109'],
    compressor_hours: ['compr[a-z.]*.?runtime', '6c60'],
    compressor_starts: ['compr[a-z.]*.?starts', '2c61'],
    energy_supplied: ['supp.?energy.?tot', '5c51'],
    energy_consumed: ['compr[a-z.]*.?consump[a-z.]*.?tot', '5c54'],
    energy_aux: ['aux.?consumption.?tot', '5c57'],
    alarm_code: ['alarm.?code|larmkod', 'ba91'],
    compressor: ['^binary_sensor[.].*(compressor|kompressor)', '1a01'],
    brine_pump: ['cold.?circuit|brine.?pump|koldbararpump', '1a04'],
    heat_carrier_pump: ['heat.?circuit|heat.?carrier.?pump', '1a05'],
    radiator_pump: ['pump.?radiator(?!.?2)|radiator.?pump(?!.?2)', '1a06'],
    switch_valve: ['switch.?valve(?!.?2)|vaxelventil', '1a07'],
    aux_heater: ['add.?heat(?!.*step)|tillsats(?!.*steg)', '3104'],
    aux_step_1: ['add.?heat.?step.?1', '1a02'],
    aux_step_2: ['add.?heat.?step.?2', '1a03'],
    alarm: ['^binary_sensor[.].*(alarm|larm)(?!.*(code|reset))', '1a20'],
    heating_setpoint: ['heating.?setpoint(?!.*2)', '0107'],
    hot_water_setpoint: ['warm.?water.?setpoint', '0111'],
    room_setpoint: ['room.?temp.?setpoint(?!.*2)', '0203'],
  };
  const DETECT = {};
  Object.keys(DETECT_RAW).forEach((k) => {
    const [names, reg] = DETECT_RAW[k];
    DETECT[k] = { name: new RegExp(names), reg: new RegExp(`(^|[^0-9a-z])${reg}([^0-9a-z]|$)`) };
  });
  const TEMPISH = new Set(['outdoor', 'indoor', 'brine_in', 'brine_out', 'heat_carrier_supply',
    'heat_carrier_return', 'radiator_supply', 'radiator_return', 'hot_water', 'hot_water_mid', 'hot_gas',
    'suction_gas', 'compressor_temp', 'heating_setpoint', 'hot_water_setpoint', 'room_setpoint']);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (m) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const slug = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9.]+/g, '_');

  function guessLang(hass) {
    let l = hass && ((hass.locale && hass.locale.language) || hass.language);
    if (!l) {
      const ha = document.querySelector('home-assistant');
      l = (ha && ha.hass && ha.hass.language) || navigator.language || 'en';
    }
    return String(l).toLowerCase().startsWith('sv') ? 'sv' : 'en';
  }

  // Temperature → colour (blue for cold brine, orange/red for hot water and hot gas).
  const STOPS = [
    [-20, [67, 56, 202]], [-5, [59, 130, 246]], [3, [14, 165, 233]], [10, [6, 182, 212]],
    [18, [20, 184, 166]], [24, [234, 179, 8]], [32, [245, 158, 11]], [40, [249, 115, 22]],
    [50, [239, 68, 68]], [70, [220, 38, 38]], [100, [153, 27, 27]],
  ];
  function tempColor(t) {
    if (t == null || !isFinite(t)) return null;
    if (t <= STOPS[0][0]) return `rgb(${STOPS[0][1].join(',')})`;
    for (let i = 1; i < STOPS.length; i++) {
      const [t1, c1] = STOPS[i];
      if (t <= t1) {
        const [t0, c0] = STOPS[i - 1];
        const f = (t - t0) / (t1 - t0);
        return `rgb(${c0.map((v, k) => Math.round(v + (c1[k] - v) * f)).join(',')})`;
      }
    }
    return `rgb(${STOPS[STOPS.length - 1][1].join(',')})`;
  }

  // Archimedean spiral – looks like the scroll of a scroll compressor.
  function spiral(cx, cy, r0, r1, turns, steps = 120) {
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * turns * Math.PI * 2;
      const r = r0 + ((r1 - r0) * i) / steps;
      d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    }
    return d;
  }
  function zigzag(x1, x2, yTop, yBot, step) {
    let d = `M${x1} ${yBot}`;
    let left = true;
    for (let y = yBot - step; y >= yTop - 0.1; y -= step) {
      left = !left;
      d += ` L${left ? x1 : x2} ${y}`;
    }
    return d;
  }

  /* ------------------------------------------------------------------ */
  /* Styles                                                              */
  /* ------------------------------------------------------------------ */
  const CSS = `
  :host {
    display: block;
    --hp-font: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif));
    --hp-text: var(--primary-text-color, #1f2937);
    --hp-text2: var(--secondary-text-color, #6b7280);
    --hp-bg: var(--ha-card-background, var(--card-background-color, #fff));
    --hp-line: var(--divider-color, rgba(127,127,127,.25));
    --hp-neutral: #94a3b8;
    --hp-cab: color-mix(in srgb, var(--hp-text) 4%, var(--hp-bg));
    --hp-cab-stroke: color-mix(in srgb, var(--hp-text) 16%, transparent);
    --hp-case: color-mix(in srgb, var(--hp-text) 13%, var(--hp-bg));
    --hp-pill: color-mix(in srgb, var(--hp-bg) 90%, transparent);
    --hp-ok: #22c55e;
    --hp-err: #ef4444;
    --hp-heat: #f97316;
    --hp-dhw: #e11d48;
    --hp-aux: #f59e0b;
  }
  ha-card {
    display: block;
    overflow: hidden;
    padding: 14px 14px 16px;
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border-radius: var(--ha-card-border-radius, 12px);
    color: var(--hp-text);
    font-family: var(--hp-font);
  }
  .hdr { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px 12px; padding: 0 2px 6px; }
  .ttl { font-size: 1.2rem; font-weight: 500; line-height: 1.3; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip {
    --chip-c: var(--hp-text2);
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px 4px 8px; border-radius: 999px; font-size: 12px; font-weight: 500; line-height: 16px;
    background: color-mix(in srgb, var(--chip-c) 13%, transparent);
    color: var(--hp-text); cursor: pointer; white-space: nowrap; user-select: none;
  }
  .chip .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--chip-c); flex: none; }
  .chip.live .dot { animation: hp-ping 1.8s ease-out infinite; }
  .chip[hidden] { display: none; }
  .schem { position: relative; }
  svg.hp { display: block; width: 100%; height: auto; overflow: visible; font-family: var(--hp-font); }
  .details { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 8px; margin-top: 10px; }
  .details:empty { display: none; }
  .tile { padding: 8px 10px; border-radius: 10px; background: color-mix(in srgb, var(--hp-text) 5%, transparent); cursor: pointer; min-width: 0; }
  .tile:hover { background: color-mix(in srgb, var(--hp-text) 9%, transparent); }
  .tile .k { font-size: 11px; color: var(--hp-text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tile .v { font-size: 15px; font-weight: 600; margin-top: 2px; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ---- SVG ---- */
  [data-key] { cursor: pointer; }
  .lbl { font-size: 8.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; fill: var(--hp-text2); }
  .medium .lbl { font-size: 9.5px; letter-spacing: .05em; }
  .nolabels .lbl, .compact .lbl { display: none; }
  .medium .pi { transform: scale(1.1); }
  .cap { font-size: 11px; font-weight: 500; fill: var(--hp-text2); }
  .big { font-size: 23px; font-weight: 600; fill: var(--hp-text); font-variant-numeric: tabular-nums; }
  .mid { font-size: 18px; font-weight: 600; fill: var(--hp-text); font-variant-numeric: tabular-nums; }
  .sml { font-size: 11px; font-weight: 500; fill: var(--hp-text2); font-variant-numeric: tabular-nums; }
  .name { font-size: 12px; font-weight: 600; fill: var(--hp-text); letter-spacing: .02em; }
  .compact .pi { transform: scale(1.22); }
  .compact .cap { font-size: 13px; }
  .compact .big { font-size: 27px; }
  .compact .mid { font-size: 21px; }
  .compact .sml { font-size: 12.5px; }
  .compact .name { font-size: 14px; }
  .compact .disp-t { font-size: 11.5px; }

  .earth { fill: url(#g-earth); }
  .strata { fill: none; stroke: #6b4f35; stroke-opacity: .22; stroke-width: 1.2; }
  .surface { fill: none; stroke: #65a30d; stroke-width: 2.5; stroke-linecap: round; }
  .grass { fill: none; stroke: #65a30d; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  .borehole { fill: #000; fill-opacity: .16; }
  .unit { fill: var(--hp-cab); stroke: var(--hp-cab-stroke); stroke-width: 1.5; }
  .grille { stroke: var(--hp-cab-stroke); stroke-width: 1.2; }
  .fan-ring { fill: color-mix(in srgb, var(--hp-text) 6%, transparent); stroke: var(--hp-cab-stroke); stroke-width: 1.5; }
  .fan path { fill: var(--hp-text2); fill-opacity: .7; }
  .wind path { fill: none; stroke: var(--hp-text2); stroke-width: 1.4; stroke-linecap: round; opacity: 0; }

  .cab { fill: var(--hp-cab); stroke: var(--hp-cab-stroke); stroke-width: 1.5; }
  .house-wall { fill: color-mix(in srgb, var(--hp-text) 3%, transparent); stroke: var(--hp-cab-stroke); stroke-width: 1.5; }
  .roof { fill: none; stroke: var(--hp-text2); stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; opacity: .75; }
  .alarm-ring { fill: none; stroke: var(--hp-err); stroke-width: 3; opacity: 0; }
  .alarm .alarm-ring { animation: hp-blink 1.1s ease-in-out infinite; }
  .led { fill: var(--hp-neutral); }
  .led.on { fill: var(--hp-ok); filter: url(#f-glow); }
  .led.err { fill: var(--hp-err); filter: url(#f-glow); animation: hp-blink 1s infinite; }

  .hx { stroke-width: 1.4; }
  .hx.evap { fill: url(#g-evap); stroke: #38bdf8; }
  .hx.cond { fill: url(#g-cond); stroke: #f97316; }
  .hx-coil { fill: none; stroke-width: 1.6; stroke-linejoin: round; opacity: .8; }
  .evap .hx-coil, .hx-coil.evap { stroke: #0ea5e9; }
  .hx-coil.cond { stroke: #ea580c; }

  .pc { fill: none; stroke: var(--hp-case); stroke-width: 10; stroke-linecap: round; stroke-linejoin: round; }
  .pk { fill: none; stroke: var(--c, var(--hp-neutral)); stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; transition: stroke 1s, opacity .6s; opacity: .55; }
  .pf { fill: none; stroke: #fff; stroke-opacity: .9; stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: .01 13.99; opacity: 0; transition: opacity .6s; }
  .pipe.ref .pc { stroke-width: 7.5; }
  .pipe.ref .pk { stroke-width: 4; }
  .pipe.ref .pf { stroke-width: 2; stroke-dasharray: .01 9.99; }
  .pipe.run .pk { opacity: 1; }
  .pipe.run .pf { opacity: 1; animation: hp-flow var(--dur, 1.4s) linear infinite; }
  .pipe.ref.run .pf { animation-name: hp-flow-ref; }
  .pipe.dim { opacity: .45; }
  .pipe.gone, .gone { display: none; }

  .comp-body { fill: url(#g-comp); stroke: #64748b; stroke-width: 1.4; }
  .comp-inner { fill: var(--hp-bg); fill-opacity: .55; stroke: #64748b; stroke-width: 1; }
  .rotor { fill: none; stroke: #475569; stroke-width: 1.8; stroke-linecap: round; }
  .comp-glow { opacity: 0; transition: opacity .8s; }
  .cmp-on .comp-glow { opacity: .7; animation: hp-pulse 2.2s ease-in-out infinite; }
  .cmp-on .rotor { stroke: #0f766e; animation: hp-spin var(--rot, .9s) linear infinite; }
  .ring-bg { fill: none; stroke: var(--hp-case); stroke-width: 3.5; }
  .ring-fg { fill: none; stroke: #14b8a6; stroke-width: 3.5; stroke-linecap: round; transition: stroke-dasharray 1s; }
  .ro .mid { font-size: 17px; }
  .compact .ro .mid { font-size: 20px; }

  .xv { fill: var(--hp-bg); stroke: var(--hp-text2); stroke-width: 1.5; stroke-linejoin: round; }
  .xv-stem { stroke: var(--hp-text2); stroke-width: 1.5; }

  .pump-body { fill: var(--hp-bg); stroke: var(--hp-text2); stroke-width: 1.6; transition: stroke .4s; }
  .imp { fill: var(--hp-text2); transition: fill .4s; }
  .pump.on .pump-body { stroke: var(--hp-ok); }
  .pump.on .imp { fill: var(--hp-ok); animation: hp-spin .8s linear infinite; }

  .aux-body { fill: var(--hp-bg); stroke: var(--hp-text2); stroke-width: 1.4; }
  .aux-coil { fill: none; stroke: var(--hp-text2); stroke-width: 1.6; stroke-linejoin: round; transition: stroke .5s; }
  .aux-glow { fill: #f97316; opacity: 0; }
  .aux-on .aux-coil { stroke: #f97316; }
  .aux-on .aux-glow { opacity: calc(.25 + var(--aux, 1) * .6); animation: hp-pulse 1.6s ease-in-out infinite; }

  .valve path { fill: var(--hp-bg); stroke: var(--hp-text2); stroke-width: 1.5; stroke-linejoin: round; transition: fill .4s; }
  .valve .act { stroke: var(--hp-text2); stroke-width: 1.5; fill: var(--hp-bg); }
  .valve .port.open { fill: var(--vc, var(--hp-heat)); stroke: var(--vc, var(--hp-heat)); }

  .rad-fin { fill: color-mix(in srgb, var(--c, #fb923c) 30%, var(--hp-bg)); stroke: var(--c, #fb923c); stroke-width: 1.3; transition: fill 1s, stroke 1s; }
  .waves path { fill: none; stroke: var(--c, #fb923c); stroke-width: 1.8; stroke-linecap: round; opacity: 0; }
  .heating .waves path { animation: hp-rise 2.6s ease-in infinite; }
  .heating .waves path:nth-child(2) { animation-delay: .85s; }
  .heating .waves path:nth-child(3) { animation-delay: 1.7s; }

  .tank-shell { fill: var(--hp-bg); stroke: var(--hp-text2); stroke-width: 1.5; }
  .tank-fill { opacity: .32; }
  .bubbles circle { fill: #fff; opacity: 0; }
  .dhw-run .bubbles circle { animation: hp-bubble 2.8s ease-in infinite; }
  .bubbles circle:nth-child(2) { animation-delay: .7s; }
  .bubbles circle:nth-child(3) { animation-delay: 1.4s; }
  .bubbles circle:nth-child(4) { animation-delay: 2.1s; }

  .disp { fill: #0b1220; stroke: #334155; stroke-width: 1; }
  .disp-t { font-family: ui-monospace, "SF Mono", Consolas, Menlo, monospace; font-size: 10px; font-weight: 600; letter-spacing: .06em; fill: #7dd3fc; }
  .alarm .disp-t { fill: #fca5a5; }

  .pill rect { fill: var(--hp-pill); stroke: var(--c, var(--hp-neutral)); stroke-width: 1.5; transition: stroke 1s; }
  .pill text { font-size: 14px; font-weight: 600; fill: var(--hp-text); font-variant-numeric: tabular-nums; }
  .pill:hover rect { stroke-width: 2.4; }
  .pill.na text { fill: var(--hp-text2); font-weight: 500; }

  .wx { display: none; }
  .wx.show { display: inline; }
  .sun-core { fill: #fbbf24; }
  .sun-rays { stroke: #fbbf24; stroke-width: 2; stroke-linecap: round; animation: hp-spin 24s linear infinite; }
  .cloud { fill: var(--hp-text2); fill-opacity: .45; }
  .flake { stroke: #7dd3fc; stroke-width: 1.8; stroke-linecap: round; fill: none; animation: hp-spin 14s linear infinite; }
  .flakes circle { fill: #bae6fd; opacity: 0; }
  .snow .flakes circle { animation: hp-fall 4.2s linear infinite; }
  .flakes circle:nth-child(2) { animation-delay: .7s; }
  .flakes circle:nth-child(3) { animation-delay: 1.4s; }
  .flakes circle:nth-child(4) { animation-delay: 2.1s; }
  .flakes circle:nth-child(5) { animation-delay: 2.8s; }
  .flakes circle:nth-child(6) { animation-delay: 3.5s; }
  .fan-on .fan { animation: hp-spin .7s linear infinite; }
  .fan-on .wind path { animation: hp-wind 1.8s linear infinite; }
  .fan-on .wind path:nth-child(2) { animation-delay: .6s; }
  .fan-on .wind path:nth-child(3) { animation-delay: 1.2s; }

  @keyframes hp-flow { to { stroke-dashoffset: -14; } }
  @keyframes hp-flow-ref { to { stroke-dashoffset: -10; } }
  @keyframes hp-spin { to { transform: rotate(360deg); } }
  @keyframes hp-pulse { 0%, 100% { opacity: .35; } 50% { opacity: .9; } }
  @keyframes hp-blink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
  @keyframes hp-rise { 0% { opacity: 0; transform: translateY(4px); } 30% { opacity: .9; } 100% { opacity: 0; transform: translateY(-16px); } }
  @keyframes hp-bubble { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: .75; } 100% { opacity: 0; transform: translateY(-62px); } }
  @keyframes hp-fall { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: .9; } 100% { opacity: 0; transform: translateY(96px); } }
  @keyframes hp-wind { 0% { opacity: 0; transform: translateX(8px); } 30% { opacity: .7; } 100% { opacity: 0; transform: translateX(-34px); } }
  @keyframes hp-ping {
    0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--chip-c) 70%, transparent); }
    100% { box-shadow: 0 0 0 6px transparent; }
  }
  .noanim *, .noanim *::before { animation: none !important; }
  @media (prefers-reduced-motion: reduce) { *, *::before { animation: none !important; } }
  `;

  /* ------------------------------------------------------------------ */
  /* SVG building blocks                                                 */
  /* ------------------------------------------------------------------ */
  const pipe = (id, d, cls = '') =>
    `<g class="pipe ${cls}" id="pp-${id}"><path class="pc" d="${d}"/><path class="pk" d="${d}"/><path class="pf" d="${d}"/></g>`;

  const pill = (key, x, y, w = 54) =>
    `<g class="pill" id="pl-${key}" data-key="${key}" transform="translate(${x} ${y})"><title></title>` +
    `<g class="pi"><rect x="${-w / 2}" y="-11.5" width="${w}" height="23" rx="11.5"/>` +
    `<text x="0" y="5" text-anchor="middle">—</text></g></g>`;

  const pump = (key, x, y) =>
    `<g class="pump" id="pm-${key}" data-key="${key}"><title></title>` +
    `<circle class="pump-body" cx="${x}" cy="${y}" r="10.5"/>` +
    `<g class="imp" style="transform-origin:${x}px ${y}px">` +
    [0, 120, 240].map((a) =>
      `<ellipse cx="${x}" cy="${y - 4}" rx="2.3" ry="4" transform="rotate(${a} ${x} ${y})"/>`).join('') +
    `</g></g>`;

  function svgMarkup(t, cfg) {
    const air = cfg.source === 'air';
    const name = esc(cfg.name != null ? cfg.name : t.heat_pump);

    // Pipe geometry (see README for a sketch). Path direction = flow direction.
    const P = air ? {
      src_out: 'M200 160 H120',
      src_u: '',
      src_in: 'M120 255 H200',
    } : {
      src_out: 'M200 160 H58 V378',
      src_u: 'M58 378 A7 7 0 0 0 72 378',
      src_in: 'M72 378 V255 H200',
    };

    const source = air ? `
      <g class="airunit">
        <path class="surface" d="M0 336 H150"/>
        <rect class="unit" x="10" y="140" width="110" height="186" rx="12"/>
        <g class="grille">${[156, 166, 176, 186, 196, 206, 216, 226, 236, 246, 256, 266, 276, 286, 296, 306]
          .map((y) => `<line x1="22" y1="${y}" x2="108" y2="${y}"/>`).join('')}</g>
        <circle class="fan-ring" cx="65" cy="230" r="40"/>
        <g class="fan" style="transform-origin:65px 230px">
          ${[0, 90, 180, 270].map((a) =>
            `<path d="M65 230 C59 216 63 200 74 196 C80 206 76 222 65 230 Z" transform="rotate(${a} 65 230)"/>`).join('')}
          <circle cx="65" cy="230" r="5" fill="var(--hp-text2)"/>
        </g>
        <g class="wind">
          <path d="M18 196 h-14"/><path d="M18 232 h-14"/><path d="M18 268 h-14"/>
        </g>
        <rect x="18" y="326" width="12" height="10" rx="2" fill="var(--hp-cab-stroke)"/>
        <rect x="100" y="326" width="12" height="10" rx="2" fill="var(--hp-cab-stroke)"/>
        <text class="lbl" x="65" y="356" text-anchor="middle">${esc(t.outdoor_unit)}</text>
      </g>` : `
      <g class="ground">
        <path class="earth" d="M0 120 H150 V388 a12 12 0 0 1 -12 12 H12 a12 12 0 0 1 -12 -12 Z"/>
        <path class="strata" d="M0 196 Q38 188 75 198 T150 191 M0 262 Q46 254 92 266 T150 258 M0 330 Q34 324 78 334 T150 326"/>
        <rect class="borehole" x="50" y="120" width="30" height="276" rx="15"/>
        <path class="surface" d="M0 120 H150"/>
        <path class="grass" d="M8 120 l3 -7 l2 7 M20 120 l2 -5 l3 5 M96 120 l3 -7 l2 7 M110 120 l2 -5 l3 5 M128 120 l3 -6 l2 6 M140 120 l2 -4 l2 4"/>
        <text class="lbl" x="115" y="388" text-anchor="middle">${esc(t.borehole)}</text>
      </g>`;

    const coil = 'M500 296 H545 A7.5 7.5 0 0 1 545 311 H512 A7.5 7.5 0 0 0 512 326 H545 A7.5 7.5 0 0 1 545 341 H512 A7.5 7.5 0 0 0 512 356 H500';

    return `
<svg class="hp" viewBox="0 0 640 400" role="img" aria-labelledby="hp-title hp-desc">
  <title id="hp-title">${name}</title>
  <desc id="hp-desc"></desc>
  <defs>
    <linearGradient id="g-earth" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#a47e57" stop-opacity=".34"/>
      <stop offset="1" stop-color="#5b4632" stop-opacity=".5"/>
    </linearGradient>
    <linearGradient id="g-evap" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#38bdf8" stop-opacity=".38"/>
      <stop offset="1" stop-color="#0ea5e9" stop-opacity=".12"/>
    </linearGradient>
    <linearGradient id="g-cond" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fb923c" stop-opacity=".12"/>
      <stop offset="1" stop-color="#ef4444" stop-opacity=".38"/>
    </linearGradient>
    <linearGradient id="g-tank" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" id="tank-top" stop-color="#ef4444"/>
      <stop offset="1" id="tank-bot" stop-color="#f59e0b"/>
    </linearGradient>
    <radialGradient id="g-comp" cx=".35" cy=".3" r=".85">
      <stop offset="0" stop-color="#f8fafc"/>
      <stop offset=".6" stop-color="#cbd5e1"/>
      <stop offset="1" stop-color="#94a3b8"/>
    </radialGradient>
    <radialGradient id="g-hot" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#f97316" stop-opacity=".65"/>
      <stop offset="1" stop-color="#f97316" stop-opacity="0"/>
    </radialGradient>
    <filter id="f-glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="f-blur" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="f-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3.5" flood-color="#000" flood-opacity=".14"/>
    </filter>
    <clipPath id="clip-tank"><rect x="500" y="232" width="70" height="140" rx="23"/></clipPath>
  </defs>

  <!-- outdoor -->
  <g class="sky" data-key="outdoor" id="sky">
    <title></title>
    <g class="wx wx-sun" id="wx-sun">
      <g class="sun-rays" style="transform-origin:28px 48px">
        ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) =>
          `<line x1="28" y1="34" x2="28" y2="30" transform="rotate(${a} 28 48)"/>`).join('')}
      </g>
      <circle class="sun-core" cx="28" cy="48" r="9"/>
    </g>
    <g class="wx wx-cloud" id="wx-cloud">
      <circle class="sun-core" cx="34" cy="42" r="7"/>
      <path class="cloud" d="M15 60 a7 7 0 0 1 3 -13.4 a9.5 9.5 0 0 1 18 2.4 a6 6 0 0 1 1 11 Z"/>
    </g>
    <g class="wx wx-snow" id="wx-snow">
      <g class="flake" style="transform-origin:28px 48px">
        <path d="M28 36 V60 M17.6 42 L38.4 54 M17.6 54 L38.4 42 M24.5 37.5 L28 40.5 L31.5 37.5 M24.5 58.5 L28 55.5 L31.5 58.5"/>
      </g>
    </g>
    <g class="flakes">
      ${[[14, 4], [44, 0], [78, 8], [104, 2], [126, 10], [140, 6]].map(([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="1.7"/>`).join('')}
    </g>
    <text class="cap" x="50" y="40">${esc(t.outdoor)}</text>
    <text class="big" x="50" y="64" id="v-outdoor">—</text>
  </g>

  ${source}

  <!-- cabinet -->
  <rect class="cab" x="160" y="40" width="250" height="345" rx="18" filter="url(#f-shadow)"/>
  <rect class="alarm-ring" x="155" y="35" width="260" height="355" rx="22"/>
  <circle class="led" id="led" cx="180" cy="61" r="4.5"/>
  <text class="name" x="191" y="65">${name}</text>

  <!-- house -->
  <g class="house">
    <rect class="house-wall" x="484" y="56" width="144" height="160" rx="3"/>
    <path class="roof" d="M474 60 L556 16 L638 60"/>
  </g>

  <!-- hot water tank -->
  <g class="dhw" id="dhw">
    <rect class="tank-shell" x="497" y="229" width="76" height="146" rx="26"/>
    <rect class="tank-fill" x="500" y="232" width="70" height="140" rx="23" fill="url(#g-tank)"/>
    <g class="bubbles" clip-path="url(#clip-tank)">
      <circle cx="556" cy="368" r="2"/><circle cx="530" cy="372" r="1.6"/>
      <circle cx="560" cy="374" r="1.4"/><circle cx="522" cy="370" r="1.8"/>
    </g>
  </g>

  <!-- pipes: ground / outdoor unit -->
  ${pipe('src_out', P.src_out)}
  ${P.src_u ? pipe('src_u', P.src_u) : ''}
  ${pipe('src_in', P.src_in)}

  <!-- refrigerant circuit -->
  ${pipe('suction', 'M218 145 V105 H250', 'ref')}
  ${pipe('hotgas', 'M300 105 H352 V145', 'ref')}
  ${pipe('liquid', 'M352 275 V310 H297', 'ref')}
  ${pipe('expanded', 'M273 310 H218 V275', 'ref')}

  <!-- heat carrier / distribution -->
  ${pipe('hc_supply', 'M370 160 H392 V78 H440')}
  ${pipe('bypass', 'M440 78 H464')}
  ${pipe('rad_supply', 'M464 78 H500 V134 H516')}
  ${pipe('rad_return', 'M574 162 H604 V386 H418 V356')}
  ${pipe('tank_supply', 'M452 90 V296 H500')}
  ${pipe('tank_coil', coil)}
  ${pipe('tank_return', 'M500 356 H418')}
  ${pipe('hc_return', 'M418 356 V255 H370')}

  <!-- evaporator -->
  <g data-key="brine_in" id="evap">
    <title>${esc(t.evaporator)}</title>
    <rect class="hx evap" x="200" y="145" width="36" height="130" rx="8"/>
    <path class="hx-coil evap" d="${zigzag(206, 230, 152, 268, 8)}"/>
  </g>
  <text class="lbl" transform="translate(247 210) rotate(-90)" text-anchor="middle">${esc(t.evaporator)}</text>

  <!-- condenser -->
  <g data-key="heat_carrier_supply" id="cond">
    <title>${esc(t.condenser)}</title>
    <rect class="hx cond" x="334" y="145" width="36" height="130" rx="8"/>
    <path class="hx-coil cond" d="${zigzag(340, 364, 152, 268, 8)}"/>
  </g>
  <text class="lbl" transform="translate(329 210) rotate(-90)" text-anchor="middle">${esc(t.condenser)}</text>

  <!-- compressor readouts (heat output / speed) -->
  <g class="ro" id="ro-heat" data-key="heat_output">
    <title></title>
    <text class="mid" x="288" y="192" text-anchor="middle" id="v-heat">—</text>
    <text class="cap" x="288" y="207" text-anchor="middle">${esc(t.heat_output)}</text>
  </g>
  <g class="ro" id="ro-speed" data-key="compressor_speed">
    <title></title>
    <text class="mid" x="288" y="240" text-anchor="middle" id="v-speed">—</text>
    <text class="cap" x="288" y="255" text-anchor="middle">${esc(t.compressor_speed)}</text>
  </g>

  <!-- compressor -->
  <g class="comp" id="comp" data-key="compressor">
    <title></title>
    <circle class="comp-glow" cx="275" cy="105" r="40" fill="url(#g-hot)"/>
    <g id="ring">
      <circle class="ring-bg" cx="275" cy="105" r="31"/>
      <circle class="ring-fg" id="ring-fg" cx="275" cy="105" r="31" transform="rotate(-90 275 105)"
        stroke-dasharray="0 999"/>
    </g>
    <circle class="comp-body" cx="275" cy="105" r="25"/>
    <circle class="comp-inner" cx="275" cy="105" r="18"/>
    <path class="rotor" style="transform-origin:275px 105px" d="${spiral(275, 105, 1.5, 15.5, 2.6)}"/>
  </g>
  <text class="lbl" x="275" y="145" text-anchor="middle">${esc(t.compressor)}</text>

  <!-- expansion valve -->
  <g id="xv">
    <title>${esc(t.expansion_valve)}</title>
    <line class="xv-stem" x1="285" y1="310" x2="285" y2="298"/>
    <rect class="xv" x="279" y="292" width="12" height="7" rx="2"/>
    <path class="xv" d="M273 302 L297 318 V302 L273 318 Z"/>
  </g>
  <text class="lbl" x="285" y="333" text-anchor="middle">${esc(t.expansion_valve)}</text>

  <!-- aux heater -->
  <g class="aux" id="aux" data-key="aux_heater">
    <title></title>
    <rect class="aux-glow" x="380" y="113" width="24" height="42" rx="8" filter="url(#f-blur)"/>
    <rect class="aux-body" x="383" y="116" width="18" height="36" rx="6"/>
    <path class="aux-coil" d="${zigzag(387, 397, 120, 148, 4)}"/>
  </g>
  <text class="lbl" transform="translate(377 131) rotate(-90)" text-anchor="middle">${esc(t.aux_heater)}</text>

  <!-- pumps -->
  ${pump('brine_pump', 180, 255)}
  ${pump('heat_carrier_pump', 392, 255)}
  ${pump('radiator_pump', 604, 236)}

  <!-- switch valve -->
  <g class="valve" id="valve" data-key="switch_valve">
    <title></title>
    <line x1="452" y1="78" x2="452" y2="66" stroke="var(--hp-text2)" stroke-width="1.5"/>
    <rect class="act" x="445" y="58" width="14" height="9" rx="2.5"/>
    <path d="M440 70 L452 78 L440 86 Z"/>
    <path class="port" id="port-rad" d="M464 70 L452 78 L464 86 Z"/>
    <path class="port" id="port-dhw" d="M444 90 L452 78 L460 90 Z"/>
  </g>

  <!-- radiator -->
  <g id="radiator" data-key="radiator_supply">
    <title></title>
    ${[0, 1, 2, 3, 4, 5].map((i) =>
      `<rect class="rad-fin" x="${516 + i * 10}" y="118" width="8" height="52" rx="3"/>`).join('')}
    <g class="waves">
      <path d="M531 112 q-4 -4 0 -8 t0 -8"/><path d="M546 112 q-4 -4 0 -8 t0 -8"/><path d="M561 112 q-4 -4 0 -8 t0 -8"/>
    </g>
  </g>

  <!-- indoor -->
  <g id="indoor" data-key="indoor">
    <title></title>
    <text class="cap" x="606" y="84" text-anchor="middle">${esc(t.indoor)}</text>
    <text class="mid" x="606" y="104" text-anchor="middle" id="v-indoor">—</text>
  </g>

  <!-- tank texts -->
  <g id="dhw-txt" data-key="hot_water">
    <title></title>
    <text class="cap" x="535" y="251" text-anchor="middle">${esc(t.hot_water)}</text>
    <text class="mid" x="535" y="273" text-anchor="middle" id="v-hw">—</text>
    <text class="sml" x="535" y="288" text-anchor="middle" id="v-hwmid"></text>
  </g>

  <!-- display -->
  <g id="display" data-key="compressor">
    <rect class="disp" x="214" y="346" width="142" height="26" rx="6"/>
    <text class="disp-t" x="285" y="363" text-anchor="middle" id="disp-t">—</text>
  </g>

  <!-- value tags -->
  ${pill('brine_out', 106, 160)}
  ${pill('brine_in', 106, 255)}
  ${pill('hot_gas', 336, 84)}
  ${pill('suction_gas', 218, 124)}
  ${pill('heat_carrier_supply', 416, 78, 48)}
  ${pill('heat_carrier_return', 418, 306)}
  ${pill('radiator_supply', 500, 104)}
  ${pill('radiator_return', 604, 300)}
</svg>`;
  }

  /* ------------------------------------------------------------------ */
  /* The card                                                            */
  /* ------------------------------------------------------------------ */
  class HeatpumpFlowCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._built = false;
      this._nf = {};
    }

    static getStubConfig(hass) {
      const lang = guessLang(hass);
      const entities = {};
      if (hass && hass.states) {
        const SETPOINTS = new Set(['heating_setpoint', 'hot_water_setpoint', 'room_setpoint']);
        const ids = Object.keys(hass.states)
          .filter((id) => /^(sensor|binary_sensor|number|input_number|climate)[.]/.test(id))
          .sort((a, b) => (/h6[06]|husdata/.test(b) ? 1 : 0) - (/h6[06]|husdata/.test(a) ? 1 : 0));
        const used = new Set();
        const isTemp = (id) => {
          const u = hass.states[id].attributes.unit_of_measurement;
          return !u || /^°?[CF]$/i.test(String(u).trim());
        };
        // Pass 1: Husdata register numbers in the entity id (most reliable). Pass 2: names.
        [['reg', (id) => id], ['name', (id) => `${id} ${slug(hass.states[id].attributes.friendly_name)}`]]
          .forEach(([kind, hay]) => {
            Object.keys(DETECT).forEach((key) => {
              if (entities[key]) return;
              const hit = ids.find((id) => !used.has(id) && DETECT[key][kind].test(hay(id))
                && (!id.startsWith('climate.') || SETPOINTS.has(key))
                && (kind === 'reg' || !TEMPISH.has(key) || isTemp(id)));
              if (hit) { entities[key] = hit; used.add(hit); }
            });
          });
      }
      return {
        name: I18N[lang].heat_pump, source: 'ground',
        animations: true, show_labels: true, show_details: true, entities,
      };
    }

    static getConfigForm() {
      const t = I18N[guessLang()];
      const T = { entity: { filter: { domain: ['sensor', 'input_number', 'number'] } } };
      const B = { entity: { filter: { domain: ['binary_sensor', 'sensor', 'switch', 'input_boolean'] } } };
      const A = { entity: {} };
      const e = (name, selector) => ({ name, selector });
      return {
        schema: [
          { name: 'title', selector: { text: {} } },
          {
            name: '', type: 'grid', schema: [
              { name: 'name', selector: { text: {} } },
              {
                name: 'source', selector: {
                  select: {
                    mode: 'dropdown', options: [
                      { value: 'ground', label: t.src_ground }, { value: 'air', label: t.src_air }],
                  },
                },
              },
            ],
          },
          {
            type: 'expandable', name: 'entities', title: t.sec_temps, icon: 'mdi:thermometer', schema:
              TEMP_KEYS.map((k) => e(k, T)),
          },
          {
            type: 'expandable', name: 'entities', title: t.sec_ops, icon: 'mdi:pump', schema: [
              e('compressor', B), e('brine_pump', B), e('heat_carrier_pump', B), e('radiator_pump', B),
              e('switch_valve', B), e('aux_heater', A), e('aux_step_1', B), e('aux_step_2', B),
              e('alarm', B), e('alarm_code', A)],
          },
          {
            type: 'expandable', name: 'entities', title: t.sec_more, icon: 'mdi:gauge', schema:
              MORE_KEYS.map((k) => e(k, A)),
          },
          {
            type: 'expandable', name: '', flatten: true, title: t.sec_look, icon: 'mdi:palette', schema: [
              {
                name: '', type: 'grid', schema: [
                  { name: 'animations', selector: { boolean: {} } },
                  { name: 'show_labels', selector: { boolean: {} } },
                  { name: 'show_details', selector: { boolean: {} } },
                  { name: 'invert_switch_valve', selector: { boolean: {} } },
                  { name: 'aux_heater_max_kw', selector: { number: { min: 0, max: 30, step: 0.5, mode: 'box' } } },
                  { name: 'decimals', selector: { number: { min: 0, max: 2, step: 1, mode: 'box' } } },
                ],
              },
            ],
          },
        ],
        computeLabel: (s) => t[s.name] || undefined,
        computeHelper: (s) => t[`h_${s.name}`] || undefined,
      };
    }

    setConfig(config) {
      if (!config || typeof config !== 'object') throw new Error('heatpump-flow-card: invalid configuration');
      if (config.entities != null && typeof config.entities !== 'object') {
        throw new Error('heatpump-flow-card: "entities" must be a mapping');
      }
      const c = {
        source: 'ground', animations: true, show_labels: true, show_details: true,
        decimals: 1, invert_switch_valve: false, missing_below: -48,
        ...config,
      };
      c.entities = { ...(config.entities || {}) };
      Object.keys(c.entities).forEach((k) => { if (!c.entities[k]) delete c.entities[k]; });
      c.names = { ...(config.names || {}) };
      if (!['ground', 'air'].includes(c.source)) c.source = 'ground';
      this._config = c;
      this._built = false;
      this._last = null;
      if (this._hass) this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._render();
    }

    connectedCallback() {
      if (this._ro && this._svg) this._ro.observe(this._svg);
    }

    disconnectedCallback() {
      if (this._ro) this._ro.disconnect();
    }

    getCardSize() { return 9; }

    getGridOptions() { return { columns: 12, min_columns: 6 }; }

    /* -------------------------------------------------------------- */
    _render() {
      if (!this._config || !this._hass) return;
      if (!this._built) this._build();
      this._update();
    }

    _build() {
      const c = this._config;
      this._lang = c.language || guessLang(this._hass);
      const t = this._t = { ...I18N[this._lang] || I18N.en, ...c.names };
      if (c.source === 'air' && !c.names.brine_in) t.brine_in = I18N[this._lang].air_in;
      if (c.source === 'air' && !c.names.brine_out) t.brine_out = I18N[this._lang].air_out;
      const E = c.entities;

      // Detail tiles (only for things that are configured)
      const tiles = [];
      if (c.show_details !== false) {
        if (E.brine_in && E.brine_out) tiles.push(['delta_brine', 'brine_in']);
        if (E.heat_carrier_supply && E.heat_carrier_return) tiles.push(['delta_heat_carrier', 'heat_carrier_supply']);
        if (E.radiator_supply && E.radiator_return) tiles.push(['delta_radiator', 'radiator_supply']);
        if (E.heat_output && E.power) tiles.push(['cop', 'power']);
        if (E.energy_supplied && E.energy_consumed) tiles.push(['scop', 'energy_supplied']);
        TILE_KEYS.forEach((k) => {
          if (E[k]) tiles.push([k, k]);
          if (k === 'compressor_starts' && E.compressor_starts && E.compressor_hours) {
            tiles.push(['hours_per_start', 'compressor_starts']);
          }
        });
        if (E.alarm_code) tiles.push(['alarm_code', 'alarm_code']);
        (c.extra_entities || []).forEach((x, i) => {
          const id = typeof x === 'string' ? x : x && x.entity;
          if (id) tiles.push([`x${i}`, null, id, typeof x === 'object' ? x.name : null]);
        });
      }
      this._tiles = tiles;

      this.shadowRoot.innerHTML = `
        <style>${CSS}</style>
        <ha-card>
          <div class="hdr">
            ${c.title ? `<div class="ttl">${esc(c.title)}</div>` : ''}
            <div class="chips">
              <span class="chip" id="c-mode" data-key="compressor"><span class="dot"></span><span class="tx"></span></span>
              <span class="chip" id="c-aux" data-key="aux_heater" hidden><span class="dot"></span><span class="tx"></span></span>
              <span class="chip" id="c-alarm" data-key="alarm" hidden><span class="dot"></span><span class="tx"></span></span>
            </div>
          </div>
          <div class="schem">${svgMarkup(t, c)}</div>
          <div class="details">${tiles.map(([id, key, ent, nm]) => `
            <div class="tile" id="t-${id}" ${key ? `data-key="${key}"` : `data-entity="${esc(ent)}"`}>
              <div class="k">${esc(nm || t[id] || '')}</div><div class="v">—</div>
            </div>`).join('')}
          </div>
        </ha-card>`;

      const root = this.shadowRoot;
      this._svg = root.querySelector('svg');
      this._svg.classList.toggle('nolabels', c.show_labels === false);
      root.querySelector('ha-card').classList.toggle('noanim', c.animations === false);
      this._svg.classList.toggle('noanim', c.animations === false);

      // Hide parts that have no entity
      TEMP_KEYS.forEach((k) => {
        const el = root.getElementById(`pl-${k}`);
        if (el && !E[k]) el.classList.add('gone');
      });
      if (!E.indoor) root.getElementById('indoor').classList.add('gone');
      if (!E.compressor_speed) {
        root.getElementById('ring').classList.add('gone');
        root.getElementById('ro-speed').classList.add('gone');
        if (E.heat_output) root.getElementById('ro-heat').setAttribute('transform', 'translate(0 24)');
      }
      if (!E.heat_output) {
        root.getElementById('ro-heat').classList.add('gone');
        if (E.compressor_speed) root.getElementById('ro-speed').setAttribute('transform', 'translate(0 -24)');
      }
      const hasDhw = !!(E.hot_water || E.hot_water_mid || E.switch_valve);
      this._hasDhw = hasDhw;
      if (!hasDhw) {
        ['dhw', 'dhw-txt', 'pp-tank_supply', 'pp-tank_coil', 'pp-tank_return', 'valve']
          .forEach((id) => root.getElementById(id).classList.add('gone'));
      } else {
        root.getElementById('pp-bypass').classList.add('gone');
      }

      // Click → more-info
      root.addEventListener('click', (ev) => {
        const el = ev.composedPath().find((n) => n.dataset && (n.dataset.key || n.dataset.entity));
        if (!el) return;
        const id = el.dataset.entity || this._config.entities[el.dataset.key];
        if (!id) return;
        const e = new Event('hass-more-info', { bubbles: true, composed: true });
        e.detail = { entityId: id };
        this.dispatchEvent(e);
      });

      // Narrow cards (phones): bigger values, no component names.
      if (this._ro) this._ro.disconnect();
      if (window.ResizeObserver) {
        this._ro = new ResizeObserver((entries) => {
          const w = entries[0].contentRect.width;
          if (w <= 0) return;
          this._svg.classList.toggle('compact', w < 430);
          this._svg.classList.toggle('medium', w >= 430 && w < 600);
          this._setDisplay();
        });
        this._ro.observe(this._svg);
      }

      const extra = tiles.filter((x) => x[2]).map((x) => x[2]);
      this._watched = [...new Set([...Object.values(E), ...extra])];
      this._built = true;
      this._last = null;
    }

    /* ---- state helpers ---- */
    _s(key) {
      const id = this._config.entities[key];
      return id ? this._hass.states[id] : undefined;
    }
    // Numeric value of an entity. Climate/water_heater entities (e.g. Husdata setpoints) keep
    // the value in the "temperature" attribute rather than in the state.
    _value(s) {
      if (!s) return { v: null, unit: '' };
      const dom = s.entity_id ? s.entity_id.split('.')[0] : '';
      if (dom === 'climate' || dom === 'water_heater') {
        const a = s.attributes;
        const v = parseFloat(a.temperature != null ? a.temperature : a.current_temperature);
        return { v: Number.isFinite(v) ? v : null, unit: a.temperature_unit || '°C' };
      }
      const v = parseFloat(s.state);
      const ok = Number.isFinite(v) && /^-?[\d.]+(e[-+]?\d+)?$/i.test(String(s.state).trim());
      return { v: ok ? v : null, unit: s.attributes.unit_of_measurement || '' };
    }
    _num(key) {
      return this._value(this._s(key)).v;
    }
    _temp(key) {
      const v = this._num(key);
      return v == null || v <= this._config.missing_below ? null : v;
    }
    _on(key) {
      const s = this._s(key);
      if (!s) return null;
      const v = String(s.state).toLowerCase().trim();
      if (['on', 'true', 'open', 'heat', 'heating', 'running', 'active', 'yes', 'problem'].includes(v)) return true;
      if (['off', 'false', 'closed', 'idle', 'no', 'unavailable', 'unknown', 'none', ''].includes(v)) return false;
      const n = parseFloat(v);
      return Number.isFinite(n) ? n > 0 : false;
    }
    _fmt(v, d) {
      if (v == null) return '—';
      const k = `${d}`;
      if (!this._nf[k]) {
        this._nf[k] = new Intl.NumberFormat(this._lang === 'sv' ? 'sv-SE' : 'en-US',
          { minimumFractionDigits: d, maximumFractionDigits: d });
      }
      return this._nf[k].format(v);
    }
    _fmtT(v) { return v == null ? '—' : `${this._fmt(v, this._config.decimals)}°`; }
    _fmtEntity(id) {
      const s = this._hass.states[id];
      if (!s) return '—';
      const t = this._t;
      const { v: n, unit } = this._value(s);
      if (n != null) {
        const d = Number.isInteger(n) ? 0 : Math.min(this._config.decimals, 2);
        return `${this._fmt(n, d)}${unit ? (/^°[CF]$/.test(unit) ? '°' : ` ${unit}`) : ''}`;
      }
      if (s.state === 'on') return t.on;
      if (s.state === 'off') return t.off;
      return `${s.state}${unit ? ` ${unit}` : ''}`;
    }
    _powerW() {
      const s = this._s('power');
      if (!s) return null;
      const v = parseFloat(s.state);
      if (!Number.isFinite(v)) return null;
      const u = (s.attributes.unit_of_measurement || 'W').trim();
      return /^kW$/i.test(u) ? v * 1000 : /^MW$/i.test(u) ? v * 1e6 : v;
    }
    _kw(key) {
      const s = this._s(key);
      if (!s) return null;
      const v = parseFloat(s.state);
      if (!Number.isFinite(v)) return null;
      const u = (s.attributes.unit_of_measurement || 'kW').trim();
      return u === 'W' ? v / 1000 : u === 'MW' ? v * 1000 : v;
    }
    _kwh(key) {
      const s = this._s(key);
      if (!s) return null;
      const v = parseFloat(s.state);
      if (!Number.isFinite(v)) return null;
      const u = (s.attributes.unit_of_measurement || 'kWh').trim();
      return u === 'Wh' ? v / 1000 : u === 'MWh' ? v * 1000 : v;
    }
    _fmtPower(w) {
      if (w == null) return null;
      return Math.abs(w) >= 1000 ? `${this._fmt(w / 1000, 2)} kW` : `${this._fmt(w, 0)} W`;
    }
    _aux() {
      const c = this._config;
      const t = this._t;
      const maxKw = Number(c.aux_heater_max_kw) || null;
      let frac = 0;
      let text = null;
      let configured = false;
      const s = this._s('aux_heater');
      if (c.entities.aux_heater) {
        configured = true;
        if (s) {
          const unit = (s.attributes.unit_of_measurement || '').trim();
          const v = parseFloat(s.state);
          if (Number.isFinite(v)) {
            if (unit === '%') {
              frac = v / 100;
              text = `${this._fmt(v, 0)} %`;
              if (maxKw && v > 0) text += ` · ${this._fmt((v / 100) * maxKw, 1)} kW`;
            } else if (/^kW$/i.test(unit)) {
              frac = maxKw ? v / maxKw : v > 0 ? 1 : 0;
              text = `${this._fmt(v, 1)} kW`;
            } else if (unit === 'W') {
              frac = maxKw ? v / 1000 / maxKw : v > 0 ? 1 : 0;
              text = this._fmtPower(v);
            } else {
              frac = v > 1 ? v / 100 : v;
              text = this._fmt(v, 0);
            }
          } else {
            const b = this._on('aux_heater');
            frac = b ? 1 : 0;
            text = b ? t.on : t.off;
          }
        }
      }
      if (c.entities.aux_step_1 || c.entities.aux_step_2) {
        configured = true;
        const s1 = !!this._on('aux_step_1');
        const s2 = !!this._on('aux_step_2');
        if (!c.entities.aux_heater) {
          frac = (s1 ? 1 : 0) / 3 + (s2 ? 2 : 0) / 3;
          const steps = [s1 && '1', s2 && '2'].filter(Boolean);
          text = steps.length ? `${t.steps} ${steps.join('+')}` : t.off;
        } else if (frac <= 0 && (s1 || s2)) {
          frac = (s1 ? 1 : 0) / 3 + (s2 ? 2 : 0) / 3;
        }
      }
      frac = clamp(frac || 0, 0, 1);
      return { configured, active: frac > 0.001, frac, text };
    }

    /* ---- DOM helpers ---- */
    _el(id) { return this.shadowRoot.getElementById(id); }
    _pipe(id, color, run, dur, dim) {
      const g = this._el(`pp-${id}`);
      if (!g) return;
      g.style.setProperty('--c', color || 'var(--hp-neutral)');
      g.classList.toggle('run', !!run);
      g.classList.toggle('dim', !!dim);
      if (dur) g.style.setProperty('--dur', `${dur.toFixed(2)}s`);
    }
    _pill(key, v, label) {
      const g = this._el(`pl-${key}`);
      if (!g) return;
      const txt = this._fmtT(v);
      g.querySelector('text').textContent = txt;
      g.style.setProperty('--c', tempColor(v) || 'var(--hp-neutral)');
      g.classList.toggle('na', v == null);
      g.querySelector('title').textContent = `${label}: ${txt}`;
    }
    _title(id, text) {
      const el = this._el(id);
      const ti = el && el.querySelector('title');
      if (ti) ti.textContent = text;
    }
    _setDisplay(text) {
      const el = this._el('disp-t');
      if (text !== undefined) this._dispText = text;
      el.textContent = this._dispText || '';
      el.removeAttribute('textLength');
      el.removeAttribute('lengthAdjust');
      // Squeeze long texts so they stay inside the little display.
      try {
        if (el.getComputedTextLength() > 130) {
          el.setAttribute('textLength', '130');
          el.setAttribute('lengthAdjust', 'spacingAndGlyphs');
        }
      } catch (e) { /* not rendered yet */ }
    }
    _chip(id, text, color, live, show = true) {
      const el = this._el(id);
      el.hidden = !show;
      if (!show) return;
      el.querySelector('.tx').textContent = text;
      el.style.setProperty('--chip-c', color);
      el.classList.toggle('live', !!live);
    }

    /* ---- update ---- */
    _update() {
      const h = this._hass;
      const c = this._config;
      const E = c.entities;
      const t = this._t;

      // Only touch the DOM when one of our entities changed.
      const cur = this._watched.map((id) => h.states[id]);
      if (this._last && cur.every((s, i) => s === this._last[i])) return;
      this._last = cur;

      const T = {};
      TEMP_KEYS.forEach((k) => { T[k] = this._temp(k); });
      const has = (k) => !!E[k];

      const valve = this._on('switch_valve');
      const hotWater = valve == null ? false : (c.invert_switch_valve ? !valve : valve);
      const aux = this._aux();
      const powerW = this._powerW();
      const comp = has('compressor') ? !!this._on('compressor')
        : powerW != null ? powerW > (Number(c.compressor_power_threshold) || 300) : false;
      const alarm = has('alarm') ? !!this._on('alarm') : false;
      const alarmCode = this._num('alarm_code');
      let mode = 'standby';
      if (comp) mode = hotWater ? 'hot_water' : 'heating';
      else if (aux.active) mode = hotWater ? 'hot_water' : 'aux';

      const brineRun = has('brine_pump') ? !!this._on('brine_pump') : comp;
      const hcRun = has('heat_carrier_pump') ? !!this._on('heat_carrier_pump') : (comp || aux.active);
      const radRun = has('radiator_pump') ? !!this._on('radiator_pump') : (hcRun && !hotWater);
      const tankRun = hcRun && hotWater;

      const speed = (k) => {
        const v = this._num(k);
        return v == null ? 1.4 : clamp(2.6 - (v / 100) * 1.9, 0.6, 3);
      };
      const durBrine = speed('brine_pump_speed');
      const durCirc = speed('circ_pump_speed');

      // Colours, with sensible fallbacks when a sensor is missing.
      const col = (v, fb) => tempColor(v) || fb;
      const cBrineOut = col(T.brine_out, '#3b82f6');
      const cBrineIn = col(T.brine_in, '#0ea5e9');
      const cHcS = col(T.heat_carrier_supply ?? T.radiator_supply, '#f97316');
      const cHcR = col(T.heat_carrier_return ?? T.radiator_return, '#f59e0b');
      const cRadS = col(T.radiator_supply ?? T.heat_carrier_supply, '#fb923c');
      const cRadR = col(T.radiator_return ?? T.heat_carrier_return, '#fbbf24');
      const cTankR = col(T.hot_water_mid != null ? T.hot_water_mid - 3 : null, cHcR);
      const midBrine = T.brine_in != null && T.brine_out != null ? (T.brine_in + T.brine_out) / 2 : null;

      const svg = this._svg;
      svg.classList.toggle('cmp-on', comp);
      svg.classList.toggle('aux-on', aux.active);
      svg.classList.toggle('alarm', alarm);
      svg.classList.toggle('heating', radRun && (T.radiator_supply == null
        || T.radiator_supply > (T.indoor != null ? T.indoor : 20) + 2));
      svg.classList.toggle('dhw-run', tankRun);
      svg.classList.toggle('fan-on', c.source === 'air' && brineRun);
      svg.style.setProperty('--aux', aux.frac.toFixed(2));

      // Pipes
      this._pipe('src_out', cBrineOut, brineRun, durBrine);
      this._pipe('src_u', col(midBrine, '#0ea5e9'), brineRun, durBrine);
      this._pipe('src_in', cBrineIn, brineRun, durBrine);
      this._pipe('suction', '#7dd3fc', comp, 0.9);
      this._pipe('hotgas', col(T.hot_gas, '#ef4444'), comp, 0.9);
      this._pipe('liquid', '#f59e0b', comp, 0.9);
      this._pipe('expanded', '#22d3ee', comp, 0.9);
      this._pipe('hc_supply', cHcS, hcRun, durCirc);
      this._pipe('bypass', cHcS, hcRun, durCirc);
      // While the valve feeds the tank the radiator loop only circulates – show it faded.
      this._pipe('rad_supply', cRadS, radRun, durCirc, this._hasDhw && hotWater);
      this._pipe('rad_return', cRadR, radRun, durCirc, this._hasDhw && hotWater);
      this._pipe('tank_supply', cHcS, tankRun, durCirc, !hotWater);
      this._pipe('tank_coil', cHcS, tankRun, durCirc, !hotWater);
      this._pipe('tank_return', cTankR, tankRun, durCirc, !hotWater);
      this._pipe('hc_return', cHcR, hcRun, durCirc);

      // Value tags
      ['brine_out', 'brine_in', 'hot_gas', 'suction_gas', 'heat_carrier_supply', 'heat_carrier_return',
        'radiator_supply', 'radiator_return'].forEach((k) => { if (has(k)) this._pill(k, T[k], t[k]); });

      // Compressor speed (inverter) and heat output
      const spd = this._num('compressor_speed');
      const spdFrac = spd == null ? null : clamp(spd / 100, 0, 1);
      if (has('compressor_speed')) {
        const circ = 2 * Math.PI * 31;
        const shown = comp && spdFrac != null ? spdFrac : 0;
        this._el('ring-fg').setAttribute('stroke-dasharray', `${(shown * circ).toFixed(1)} 999`);
        this._el('v-speed').textContent = spd == null ? '—' : `${this._fmt(spd, 0)} %`;
        this._title('ro-speed', `${t.compressor_speed}: ${this._fmtEntity(E.compressor_speed)}`);
      }
      // Faster scroll animation the harder the compressor works.
      svg.style.setProperty('--rot', `${spdFrac == null ? 0.9 : clamp(1.8 - spdFrac * 1.5, 0.3, 1.8).toFixed(2)}s`);
      const heatKw = this._kw('heat_output');
      if (has('heat_output')) {
        this._el('v-heat').textContent = heatKw == null ? '—' : `${this._fmt(heatKw, 1)} kW`;
        this._title('ro-heat', `${t.heat_output}: ${this._fmtEntity(E.heat_output)}`);
      }

      // Outdoor
      const out = T.outdoor;
      this._el('v-outdoor').textContent = this._fmtT(out);
      const wx = out == null ? 'cloud' : out <= 0 ? 'snow' : out < 12 ? 'cloud' : 'sun';
      ['sun', 'cloud', 'snow'].forEach((w) => this._el(`wx-${w}`).classList.toggle('show', w === wx));
      svg.classList.toggle('snow', wx === 'snow');
      this._title('sky', `${t.outdoor}: ${this._fmtT(out)}`);

      // Indoor
      if (has('indoor')) {
        this._el('v-indoor').textContent = this._fmtT(T.indoor);
        this._title('indoor', `${t.indoor}: ${this._fmtT(T.indoor)}`);
      }

      // Radiator
      const rad = this._el('radiator');
      rad.style.setProperty('--c', cRadS);
      this._title('radiator', `${t.radiator_supply}: ${this._fmtT(T.radiator_supply)} · ${t.radiator_return}: ${this._fmtT(T.radiator_return)}`);

      // Hot water tank
      if (this._hasDhw) {
        const hw = T.hot_water;
        const hwMid = T.hot_water_mid;
        this._el('v-hw').textContent = this._fmtT(hw);
        this._el('v-hwmid').textContent = hwMid != null ? `${t.mid} ${this._fmtT(hwMid)}` : '';
        this._el('tank-top').setAttribute('stop-color', col(hw, '#ef4444'));
        this._el('tank-bot').setAttribute('stop-color', col(hwMid != null ? hwMid : hw != null ? hw - 14 : null, '#f59e0b'));
        this._title('dhw-txt', `${t.hot_water}: ${this._fmtT(hw)}`);
        const vc = hotWater ? 'var(--hp-dhw)' : 'var(--hp-heat)';
        const v = this._el('valve');
        v.style.setProperty('--vc', vc);
        this._el('port-rad').classList.toggle('open', !hotWater);
        this._el('port-dhw').classList.toggle('open', hotWater);
        this._title('valve', `${t.switch_valve}: ${hotWater ? t.hot_water : t.mode_heating}`);
      }

      // Components
      this._title('comp', [`${t.compressor}: ${comp ? t.on : t.off}`,
        spd != null ? `${t.compressor_speed}: ${this._fmt(spd, 0)} %` : '',
        has('compressor_temp') ? `${t.compressor_temp}: ${this._fmtEntity(E.compressor_temp)}` : '',
      ].filter(Boolean).join('\n'));
      [['brine_pump', brineRun], ['heat_carrier_pump', hcRun], ['radiator_pump', radRun]].forEach(([k, on]) => {
        const el = this._el(`pm-${k}`);
        el.classList.toggle('on', on);
        el.querySelector('title').textContent = `${t[k]}: ${on ? t.on : t.off}${has(k) ? '' : ' *'}`;
      });
      this._title('aux', `${t.aux_heater}: ${aux.text || (aux.active ? t.on : t.off)}`);
      const led = this._el('led');
      led.classList.toggle('on', comp && !alarm);
      led.classList.toggle('err', alarm);

      // Display on the cabinet
      const modeTxt = t[`mode_${mode}`];
      let disp = modeTxt.toUpperCase();
      if (alarm) disp = `${t.alarm.toUpperCase()}${alarmCode != null ? ` ${alarmCode}` : ''}`;
      else if (powerW != null) disp += ` · ${this._fmtPower(powerW)}`;
      else if (aux.active && aux.text && mode !== 'aux') disp += ` + ${t.aux_heater.toUpperCase()}`;
      this._setDisplay(disp);

      // Chips
      const modeColor = { heating: 'var(--hp-heat)', hot_water: 'var(--hp-dhw)', aux: 'var(--hp-aux)', standby: 'var(--hp-text2)' }[mode];
      this._chip('c-mode', modeTxt, modeColor, mode !== 'standby');
      this._chip('c-aux', `${t.aux_heater}: ${aux.text || '—'}`, aux.active ? 'var(--hp-aux)' : 'var(--hp-text2)',
        aux.active, aux.configured);
      this._chip('c-alarm', alarm ? `${t.alarm}${alarmCode != null ? ` ${alarmCode}` : ''}` : t.no_alarm,
        alarm ? 'var(--hp-err)' : 'var(--hp-ok)', alarm, has('alarm'));

      // Details
      const delta = (a, b) => (a != null && b != null ? `${this._fmt(a - b, 1)}°` : '—');
      this._tiles.forEach(([id, key, ent]) => {
        const el = this._el(`t-${id}`);
        if (!el) return;
        let v;
        if (id === 'delta_brine') v = delta(T.brine_in, T.brine_out);
        else if (id === 'delta_heat_carrier') v = delta(T.heat_carrier_supply, T.heat_carrier_return);
        else if (id === 'delta_radiator') v = delta(T.radiator_supply, T.radiator_return);
        else if (id === 'cop') {
          v = heatKw != null && powerW != null && powerW > 50 && comp ? this._fmt((heatKw * 1000) / powerW, 2) : '—';
        } else if (id === 'scop') {
          const sup = this._kwh('energy_supplied');
          const used = (this._kwh('energy_consumed') || 0) + (this._kwh('energy_aux') || 0);
          v = sup != null && used > 0 ? this._fmt(sup / used, 2) : '—';
        } else if (id === 'hours_per_start') {
          const hrs = this._num('compressor_hours');
          const st = this._num('compressor_starts');
          v = hrs != null && st ? `${this._fmt(hrs / st, 1)} h` : '—';
        } else v = this._fmtEntity(ent || E[key]);
        el.querySelector('.v').textContent = v;
      });

      // Accessible summary
      this._el('hp-desc').textContent = [
        `${modeTxt}`, `${t.compressor} ${comp ? t.on : t.off}`,
        out != null ? `${t.outdoor} ${this._fmtT(out)}` : '',
        T.radiator_supply != null ? `${t.radiator_supply} ${this._fmtT(T.radiator_supply)}` : '',
        T.hot_water != null ? `${t.hot_water} ${this._fmtT(T.hot_water)}` : '',
        alarm ? t.alarm : '',
      ].filter(Boolean).join(', ');
    }
  }

  customElements.define(TAG, HeatpumpFlowCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG,
    name: 'Heat Pump Flow Card',
    description: 'Animated heat pump schematic – compressor, brine, heating and hot water circuits.',
    preview: true,
    documentationURL: 'https://github.com/em0g/heatpump-flow-card',
  });

  // eslint-disable-next-line no-console
  console.info(`%c HEATPUMP-FLOW-CARD %c v${VERSION} `,
    'color:#fff;background:#f97316;font-weight:600;border-radius:3px 0 0 3px',
    'color:#f97316;background:#1f2937;border-radius:0 3px 3px 0');
})();

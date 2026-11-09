# Heat Pump Flow Card

Ett animerat Lovelace-kort för Home Assistant som visar värmepumpen i genomskärning: borrhål eller utedel, köldmediekretsen (förångare, kompressor, kondensor, expansionsventil), tillsatsen, växelventilen, radiatorkretsen och varmvattenberedaren.

Kortet är byggt med Husdata H60/H66 och IVT i åtanke, men fungerar med alla värmepumpar. Du kopplar bara in de sensorer du har, och delar utan sensor räknas ut eller döljs.

## Vad kortet visar

- **Rör färgade efter temperatur**: kall köldbärare är blå och varm framledning orange/röd. Prickar i rören visar flödesriktningen när respektive pump går.
- **Kompressorn** snurrar och glöder när den går. På varvtalsstyrda pumpar visar en ring runt den hur hårt den jobbar, och den snurrar fortare ju högre varvtal. Mitt i skåpet visas avgiven värmeeffekt och varvtal.
- **Växelventilen** visar om värmen går till radiatorerna eller till varmvattnet. Den inaktiva grenen tonas ner.
- **Tillsatsen (elpatronen)** glöder, starkare ju högre effekt.
- **Varmvattenberedaren** färgas efter temperaturen, och bubblor stiger vid varmvattenladdning.
- **Radiatorn** ger ifrån sig värmevågor när det går värme till huset.
- **Utetemperatur** visas med sol, moln eller snöflingor beroende på temperaturen.
- **Larm** ger röd blinkande ram, röd statuslampa och larmkod i displayen på skåpet.
- **Statuschips** visar driftläge, tillsats och larm, och **detaljrutor** visar ΔT, börvärden, drifttid och energi.
- **Uträknade värden**: SCOP från energimätarna, COP just nu (om du har en elmätare) och genomsnittlig drifttid per kompressorstart.
- Klicka på en temperatur, pump eller ruta för att öppna Home Assistants historikfönster.
- Fungerar i ljust och mörkt tema och anpassar storleken på temperaturerna till kortets bredd (mobil, sektion, helskärm).
- Kortet har en visuell redigerare, och följer inställningen *reducera rörelse* om den är på.

## Installation

### Via HACS (rekommenderas)

1. HACS → ⋮ → **Anpassade arkiv** (Custom repositories)
   - Arkiv: `https://github.com/em0g/heatpump-flow-card`
   - Typ: **Dashboard**
2. Sök fram **Heat Pump Flow Card** i HACS, installera och ladda om webbläsaren (Ctrl+F5).

HACS lägger själv till resursen `/hacsfiles/heatpump-flow-card/heatpump-flow-card.js`.

### Manuellt

1. Kopiera `dist/heatpump-flow-card.js` till `/config/www/heatpump-flow-card.js`.
2. **Inställningar → Instrumentpaneler → ⋮ → Resurser → Lägg till resurs**
   - URL: `/local/heatpump-flow-card.js`
   - Typ: **JavaScript-modul**
3. Ladda om webbläsaren (Ctrl+F5).

Byter du fil senare: lägg till `?v=2` i resurs-URL:en så att webbläsaren inte använder en gammal cachad version.

## Snabbstart med Husdata H66

Lägg till kortet via **Redigera instrumentpanel → Lägg till kort → Heat Pump Flow Card**. Kortet letar då själv upp Husdata-sensorerna, både på registernummer (t.ex. `0007`, `1A01`) och på namn (t.ex. "Brine in", "Compressor"), och fyller i så mycket det hittar. Kontrollera resten i redigeraren.

Husdatas MQTT-autodiscovery döper entiteterna efter enhetens namn plus Husdatas namn, t.ex. `sensor.hp_h66outdoor`, `sensor.hp_h66brine_in_evaporator` och `binary_sensor.hp_h66compressor` när enheten heter "HP". Inställningar som rumsbörvärdet blir climate-entiteter (`climate.hp_h66room_temp_setpoint`), och kortet läser deras temperaturattribut.

Vill du se exakt vilka entiteter du har, klistra in detta under **Utvecklarverktyg → Mall**:

```jinja
{% for s in states if 'h66' in s.entity_id or 'h60' in s.entity_id or 'husdata' in s.entity_id %}
{{ s.entity_id }}  |  {{ s.name }}  |  {{ s.state }} {{ s.attributes.unit_of_measurement | default('') }}
{%- endfor %}
```

Ändra `'h66'` till det som står i dina entity-id:n om inget dyker upp.

Kompletta exempel:
- IVT Rego 2000/3000/3100 (varvtalsstyrda, t.ex. Greenline HE/PremiumLine): [examples/husdata-h66-ivt-rego2000-3000.yaml](examples/husdata-h66-ivt-rego2000-3000.yaml)
- IVT Rego 600/637 (t.ex. Greenline HT Plus): [examples/husdata-h66-ivt-rego600.yaml](examples/husdata-h66-ivt-rego600.yaml)

Vilket styrsystem du har står under *Controller* på gatewayens startsida.

## Exempel

```yaml
type: custom:heatpump-flow-card
title: Bergvärme
name: IVT bergvärme
language: sv              # annars följer kortet HA:s språk
source: ground            # ground = berg/mark, air = luft/vatten
aux_heater_max_kw: 9      # används för att visa tillsatsen i kW
entities:
  outdoor: sensor.hp_h66outdoor
  indoor: sensor.hp_h66indoor
  brine_in: sensor.hp_h66brine_in_evaporator
  brine_out: sensor.hp_h66brine_out_condenser
  heat_carrier_supply: sensor.hp_h66heat_carrier_forwrd
  heat_carrier_return: sensor.hp_h66heat_carrier_return
  radiator_supply: sensor.hp_h66radiator_forward
  hot_water: sensor.hp_h66warm_water_1_top
  hot_gas: sensor.hp_h66hot_gas
  suction_gas: sensor.hp_h66suction_gas
  compressor: binary_sensor.hp_h66compressor
  compressor_speed: sensor.hp_h66compressor_speed
  heat_output: sensor.hp_h66compressor_power
  brine_pump: binary_sensor.hp_h66pump_cold_circuit
  heat_carrier_pump: binary_sensor.hp_h66pump_heat_circuit
  radiator_pump: binary_sensor.hp_h66pump_radiator
  switch_valve: binary_sensor.hp_h66switch_valve_1
  aux_heater: sensor.hp_h66add_heat_status
  alarm: binary_sensor.hp_h66alarm
```

## Entiteter

Alla är valfria. Registernumren är Husdatas (H66) för IVT Rego 600/637, Rego 1000 och Rego 2000/3000.

| Nyckel | Beskrivning | Husdata-register |
|---|---|---|
| `outdoor` | Utetemperatur | 0007 |
| `indoor` | Innetemperatur | 0008 |
| `brine_in` | Köldbärare in (från borrhålet). Förångare på luft/vatten | 0005 |
| `brine_out` | Köldbärare ut (till borrhålet) | 0006 |
| `heat_carrier_supply` | Värmebärare fram (efter kondensorn, GT8) | 0004 |
| `heat_carrier_return` | Värmebärare retur (GT9) | 0003 |
| `radiator_supply` | Framledning till radiatorer | 0002 |
| `radiator_return` | Returledning från radiatorer (GT1) | 0001 |
| `hot_water` | Varmvatten, topp | 0009 |
| `hot_water_mid` | Varmvatten, mitt eller extern tank | 000A |
| `hot_gas` | Hetgas efter kompressorn | 000B |
| `suction_gas` | Suggas före kompressorn | 000C |
| `compressor_temp` | Kompressortemperatur | 0014 |
| `compressor` | Kompressor på/av | 1A01 |
| `compressor_speed` | Kompressorns varvtal i % (varvtalsstyrda pumpar) | 3108 |
| `heat_output` | Avgiven värmeeffekt (kW eller W) | 9112 |
| `brine_pump` | Köldbärarpump på/av | 1A04 |
| `heat_carrier_pump` | Värmebärarpump på/av | 1A05 |
| `radiator_pump` | Radiatorpump på/av | 1A06 |
| `switch_valve` | Växelventil. På/1 = varmvatten, Av/0 = värme | 1A07 |
| `aux_heater` | Tillsats i %, kW, W eller på/av | 3104 |
| `aux_step_1`, `aux_step_2` | Tillsatssteg (3 kW / 6 kW) om du inte har `aux_heater` | 1A02, 1A03 |
| `alarm` | Larm på/av | 1A20 |
| `alarm_code` | Larmkod | BA91 (Rego 600) / 2A91 |
| `heating_setpoint` | Börvärde värme (beräknad framledning) | 0107 |
| `hot_water_setpoint` | Börvärde varmvatten | 0111 |
| `room_setpoint` | Rumsbörvärde | 0203 |
| `power` | Elförbrukning från en elmätare (W eller kW). Visas i displayen och ger COP just nu | – |
| `energy` | Valfri energisensor (kWh) | – |
| `energy_supplied` | Avgiven energi totalt. Ger SCOP tillsammans med nästa två | 5C51 |
| `energy_consumed` | Förbrukad energi kompressor totalt | 5C54 |
| `energy_aux` | Förbrukad energi tillsats totalt | 5C57 |
| `compressor_hours` | Drifttid kompressor | 6C60 (Rego 600: 6C55) |
| `compressor_starts` | Antal kompressorstarter. Ger drifttid per start | 2C61 |
| `brine_pump_speed` | Varvtal köldbärarpump i %. Styr flödesanimationens hastighet | 3110 |
| `circ_pump_speed` | Varvtal cirkulationspump i % | 3109 |

## Inställningar

| Inställning | Standard | Beskrivning |
|---|---|---|
| `title` | – | Rubrik överst på kortet |
| `name` | `Värmepump` | Namnet på skåpet, t.ex. modellen |
| `source` | `ground` | `ground` visar borrhål, `air` visar en utedel med fläkt |
| `aux_heater_max_kw` | – | Tillsatsens maxeffekt. Gör att procent även visas i kW |
| `invert_switch_valve` | `false` | Vänd på växelventilen om din visar tvärtom |
| `animations` | `true` | Stäng av alla animationer |
| `show_labels` | `true` | Komponentnamn i schemat. Döljs alltid på smala kort |
| `show_details` | `true` | Detaljrutorna under schemat |
| `decimals` | `1` | Antal decimaler för temperaturer |
| `missing_below` | `-48` | Värden under detta räknas som "givare saknas" (Husdata visar −49 för givare som inte finns) |
| `compressor_power_threshold` | `300` | Har du ingen `compressor`-sensor men en `power`-sensor räknas kompressorn som igång över så här många watt |
| `language` | från HA | `sv` eller `en` |
| `names` | – | Byt ut texter, t.ex. `names: { brine_in: "Förångare in" }` |
| `extra_entities` | – | Fler detaljrutor: lista med entity-id eller `{ entity, name }` |

## Så tolkas värdena

- **På/av-sensorer** räknas som igång vid `on`, `true`, `1` eller ett tal över 0.
- **Saknas en pumpsensor** gissar kortet: köldbärarpumpen går när kompressorn går, värmebärarpumpen när kompressorn eller tillsatsen går, och radiatorkretsen när det inte laddas varmvatten.
- **Driftläge**: kompressor + växelventil på varmvatten ger *Varmvatten*, kompressor annars ger *Värmedrift*, bara tillsats ger *Endast tillsats*, annars *Vila*.
- **SCOP** = avgiven energi ÷ (kompressorns + tillsatsens förbrukade energi), över hela pumpens livstid.
- **Varmvattenberedaren och växelventilen** visas bara om du har `hot_water`, `hot_water_mid` eller `switch_valve`.

## Andra värmepumpar

Kortet bryr sig bara om entiteterna, inte om märket. Det fungerar till exempel med Nibe (Myuplink eller Nibe Modbus), Thermia (Husdata eller Thermia Online), Bosch och IVT via EMS-ESP, eller Daikin och Panasonic luft/vatten. Välj `source: air` för luft/vatten och koppla in de temperaturer som finns. Rör och komponenter utan sensor får neutrala standardfärger.

## Testa utan Home Assistant

Starta demoservern i projektmappen:

```bash
python demo/serve.py
```

Gå sedan till <http://localhost:8765/demo/> och klicka mellan scenarierna (värmedrift, varmvatten, tillsats, vila, larm), temat, bredden och luft/vatten.

Har du en Husdata H60/H66 kan demon visa din egen pump live. Servern läser då gatewayens statussida var femte sekund. Den läser bara och ändrar ingenting:

```bash
python demo/serve.py --h66 192.168.1.50
```

Klicka på **Live: din H66**. Kortets autodetektering bygger då konfigurationen precis som när du lägger till kortet i Home Assistant, och den hamnar i webbläsarens konsol.

Autodetekteringen testas mot riktiga Husdata-entiteter (Node 20+):

```bash
node --test
```

## Licens

MIT

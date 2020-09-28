import { Canard } from '../models/canard';

export function mitterrandRule(beaujolais, canard: Canard) {
  console.log('mitterrandRule');
  const visible = beaujolais > 100;
  console.log('canard.name', canard.name);
  const disabled = canard.name === "coucou";

  return { config: { visible, disabled } };
}

export function pressingRule(beaujolais, mitterrand, time) {
  console.log('pressingRule');
  const label =
    beaujolais === 101 && mitterrand === "homard" ? "youpi" : "pressing";
  return { config: { label }, pressing: time };
}

export function beaujolaisRule(canard: Canard) {
  console.log('beaujolaisRule');
  if (canard.name === "lucca") return { beaujolais: 101 };
  return {};
}

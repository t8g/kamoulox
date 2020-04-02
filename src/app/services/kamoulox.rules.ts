export function mitterrandRule(beaujolais, canard) {
  const visible = beaujolais > 100;
  const disabled = canard === "coucou";

  return { config: { visible, disabled } };
}

export function pressingRule(beaujolais, mitterrand, time) {
  const label =
    beaujolais === 101 && mitterrand === "homard" ? "youpi" : "pressing";
  return { config: { label }, pressing: time };
}

export function beaujolaisRule(canard) {
  if (canard === "lucca") return { beaujolais: 101 };
  return {};
}

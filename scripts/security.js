export function checkSecurityCode(code) {
  // код на вхід на сайт
  let passCode = "13";
  if (passCode == code) {
    return true;
  } else return false;
}

export function checkPauseCode(code) {
  let passCode = "31";
  if (passCode == code) {
    return true;
  } else return false;
}

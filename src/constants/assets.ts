/**
 * CASE ZERO Visual Asset Registry
 * High-contrast Neo-Noir Illustrations for Scenes and Evidence
 */

export const SceneImages = {
  danubeEcho: require('../../assets/images/scenes/danube_echo_crime_scene.jpg'),
  lastAppointment: require('../../assets/images/scenes/last_appointment_scene.jpg'),
} as const;

export const EvidenceImages: Record<string, any> = {
  ev_spent_shell_casing: require('../../assets/images/evidence/shell_casing.jpg'),
  ev_pocket_watch_log: require('../../assets/images/evidence/encrypted_ledger.jpg'),
  ev_tram_ticket: require('../../assets/images/evidence/tram_ticket.jpg'),
};

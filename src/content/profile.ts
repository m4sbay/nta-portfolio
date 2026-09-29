export type Profile = {
  name: string;
  profession?: string;
  headline?: string;
  description?: string;
};

// Only publish verified biographical details. Optional fields are ready for copy.
export const profile: Profile = {
  name: "Dwi Sinta Maharani"
};

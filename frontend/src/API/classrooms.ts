import api from "./axios";

export async function joinClassroomByCode(code: string) {
  const response = await api.post("/class/class/join", {
    code,
  });

  return response.data;
}

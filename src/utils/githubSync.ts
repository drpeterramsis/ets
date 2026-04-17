import { Employee } from "../types";

export const saveToGitHub = async (
  updatedEmployees: Employee[]
): Promise<{ success: boolean; message: string }> => {

  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const repo = import.meta.env.VITE_GITHUB_REPO;
  const filePath = import.meta.env.VITE_GITHUB_FILE_PATH;
  const branch = import.meta.env.VITE_GITHUB_BRANCH || "main";

  const apiUrl =
    `https://api.github.com/repos/${repo}/contents/${filePath}`;

  try {
    // STEP A: Get current file SHA
    const getRes = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!getRes.ok) {
      return { 
        success: false, 
        message: "Failed to fetch file from GitHub" 
      };
    }

    const fileData = await getRes.json();
    const sha = fileData.sha;

    // STEP B: Encode content to base64
    const newContent = JSON.stringify(updatedEmployees, null, 2);
    const encoded = btoa(
      unescape(encodeURIComponent(newContent))
    );

    // STEP C: Push updated file
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "EVA SIM: Employee data updated via facilitator",
        content: encoded,
        sha: sha,
        branch: branch,
      }),
    });

    if (putRes.ok) {
      return { 
        success: true, 
        message: "Saved to GitHub successfully ✅" 
      };
    } else {
      const err = await putRes.json();
      return { 
        success: false, 
        message: err.message || "GitHub save failed" 
      };
    }

  } catch (error) {
    return { 
      success: false, 
      message: "Network error. Could not reach GitHub." 
    };
  }
};

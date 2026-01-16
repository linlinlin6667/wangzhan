export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const action = url.searchParams.get('action') || 'all';
      
      const dataUrl = 'https://raw.githubusercontent.com/linlinlin6667/wangzhan/main/data.json';
      const dataResponse = await fetch(dataUrl);
      const data = await dataResponse.json();
      
      if (request.method === 'POST') {
        const requestBody = await request.json();
        const result = await updateData(action, requestBody, data);
        
        return new Response(JSON.stringify({
          success: true,
          data: result
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
      
      let responseData;
      switch (action) {
        case 'personal':
          responseData = data.personal;
          break;
        case 'projects':
          responseData = data.projects;
          break;
        case 'tools':
          responseData = data.tools;
          break;
        case 'skills':
          responseData = data.skills;
          break;
        case 'stats':
          responseData = data.stats;
          break;
        case 'all':
        default:
          responseData = data;
          break;
      }
      
      return new Response(JSON.stringify({
        success: true,
        data: responseData
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

async function updateData(action, newData, currentData) {
  switch (action) {
    case 'personal':
      currentData.personal = { ...currentData.personal, ...newData };
      break;
    case 'projects':
      if (newData.id) {
        const index = currentData.projects.findIndex(p => p.id === newData.id);
        if (index !== -1) {
          currentData.projects[index] = { ...currentData.projects[index], ...newData };
        }
      } else {
        currentData.projects.push({ ...newData, id: Date.now() });
      }
      break;
    case 'tools':
      if (newData.id) {
        const index = currentData.tools.findIndex(t => t.id === newData.id);
        if (index !== -1) {
          currentData.tools[index] = { ...currentData.tools[index], ...newData };
        }
      } else {
        currentData.tools.push({ ...newData, id: Date.now() });
      }
      break;
    case 'skills':
      if (newData.id) {
        const index = currentData.skills.findIndex(s => s.id === newData.id);
        if (index !== -1) {
          currentData.skills[index] = { ...currentData.skills[index], ...newData };
        }
      } else {
        currentData.skills.push({ ...newData, id: Date.now() });
      }
      break;
    case 'stats':
      currentData.stats = { ...currentData.stats, ...newData };
      break;
  }
  
  return currentData;
}

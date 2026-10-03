let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';

function updateClock() {
  const now = new Date();
  
  let timeString;
  try {
    timeString = new Intl.DateTimeFormat('pt-BR', {
      timeZone: userTimeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(now);
  } catch(e) {
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    timeString = `${h}:${m}`;
  }
  
  const clockEl = document.getElementById('clock');
  if(clockEl) {
    clockEl.textContent = timeString;
  }
}

updateClock();
setInterval(updateClock, 1000);


async function fallbackIPLocation() {
  const locationEl = document.getElementById('user-location');
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data && data.city) {
      locationEl.textContent = `${data.city}, ${data.region_code}`;
      if (data.timezone) {
        userTimeZone = data.timezone;
        updateClock();
      }
    } else {
      locationEl.textContent = 'Visitante';
    }
  } catch (error) {
    locationEl.textContent = 'Visitante';
  }
}

function fetchUserLocation() {
  const locationEl = document.getElementById('user-location');
  if (!locationEl) return;
  
  if (navigator.geolocation) {
    locationEl.textContent = 'Aguardando...';
    

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          

          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`);
          const data = await response.json();
          
          if (data && (data.city || data.locality)) {
            const cidade = data.city || data.locality;
            let estado = data.principalSubdivisionCode || data.principalSubdivision;
            if (estado && estado.includes('-')) {
              estado = estado.split('-').pop();
            }
            locationEl.textContent = `${cidade}, ${estado}`;
          } else {
            fallbackIPLocation();
          }
        } catch (error) {
          fallbackIPLocation();
        }
      },
      (error) => {

        console.warn('Permissão de localização negada pelo usuário. Recorrendo ao IP.');
        fallbackIPLocation();
      }
    );
  } else {

    fallbackIPLocation();
  }
}

fetchUserLocation();

function downloadCV(event) {
  if (event && event.currentTarget) {
    const btn = event.currentTarget;
    btn.style.transition = 'transform 0.15s ease-out';
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 150);
  }

  const wave = document.createElement('div');
  wave.classList.add('wave-effect');
  
  if (event) {
    wave.style.left = `${event.clientX}px`;
    wave.style.top = `${event.clientY}px`;
  } else {
    wave.style.left = '50%';
    wave.style.top = '50%';
  }
  
  document.body.appendChild(wave);
  
  setTimeout(() => {
    wave.remove();
  }, 2800);

  const link = document.createElement('a');

  link.href = './CV.pdf';
  link.download = 'CV.pdf';

  link.style.display = 'none';
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    
    const modalClose = document.querySelector('.modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalCat = document.getElementById('modal-cat');
    const modalLink = document.getElementById('modal-link');

    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (!card) return;
        
        e.preventDefault();
        
        const title = card.querySelector('.project-name').innerText;
        const cat = card.querySelector('.project-cat').innerText;
        const projectImgHtml = card.querySelector('.project-img').innerHTML;
        const href = card.getAttribute('href');
        
        modalTitle.innerText = title;
        modalCat.innerText = cat;
        
        const modalImgContainer = document.querySelector('.modal-img-container');
        modalImgContainer.innerHTML = projectImgHtml;
        
        modalLink.href = href;
        
        modal.style.display = 'flex';

        void modal.offsetWidth;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            if(!modal.classList.contains('show')) {
                modal.style.display = 'none';
            }
        }, 400);
    };

    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});

const translations = {
  "Disponível para Trabalho": "Available for Work",
  "Indisponível para Trabalho": "Unavailable for Work",
  "Engenheiro de Automação de QA | Robot Framework | Python | Appium | Testes de API | Testes Web e Mobile | Jenkins | Qualidade de Software": "QA Automation Engineer | Robot Framework | Python | Appium | API Testing | Web & Mobile Testing | Jenkins | Software Quality",
  "Download do CV": "Download CV",
  "Contato": "Contact",
  "Sobre Mim": "About Me",
  "Profissional de Quality Assurance (QA) com experiência em Testes Manuais e Automação de Testes para aplicações Web, Mobile (Android) e APIs REST. Atuo na criação e execução de testes Funcionais, Smoke, Regressão e End-to-End (E2E), elaboração de cenários e casos de teste, análise de requisitos, identificação e gestão de bugs e garantia da qualidade durante todo o ciclo de desenvolvimento.": "Quality Assurance (QA) professional experienced in manual and automated testing for Web, Mobile (Android), and REST API applications. My work involves creating and executing functional, smoke, regression, and end-to-end (E2E) tests; designing test plans and test cases; analyzing requirements; identifying and managing bugs; and ensuring quality throughout the development lifecycle.",
  "Possuo experiência com Robot Framework, Python, Selenium, Appium, Jenkins, Jira, Confluence, Git e metodologias ágeis (Scrum e Kanban). Tenho foco em Quality Engineering, Test Automation, CI/CD, Continuous Testing e melhoria contínua dos processos, contribuindo para a entrega de software confiável, estável e de alta qualidade.": "I have experience with Robot Framework, Python, Selenium, Appium, Jenkins, Jira, Confluence, Git, and Agile methodologies (Scrum and Kanban). I focus on Quality Engineering, Test Automation, CI/CD, Continuous Testing, and continuous process improvement, contributing to the delivery of reliable, stable, and high-quality software.",
  "Projetos": "Projects",
  "Site Portfólio": "Portfolio Website",
  "Portfólio para apresentar projetos pessoais": "Portfolio to showcase personal projects",
  "Experiências": "Experience",
  "QA Tester - Estagiário": "QA Tester - Intern",
  "QA Tester - Temporário": "QA Tester - Temporary",
  "📍 Manaus, AM (Híbrido)":"📍 Manaus, AM (Hybrid)",
  "📍 Estados Unidos, US (Remoto)":"📍 United States, US (Remote)",
  // Instituto de Pesquisas Eldorado
  "- Elaboração de cenários e casos de teste, com execução de testes funcionais, smoke, regressão e end-to-end (E2E).":"- Development of test scenarios and cases, including the execution of functional, smoke, regression, and end-to-end (E2E) tests.",
  "- Colaboração com equipes de desenvolvimento e produto durante todo o ciclo de desenvolvimento.":"- Collaboration with development and product teams throughout the development cycle.",
  "- Identificação, registro e acompanhamento de bugs utilizando Jira.":"- Identification, logging, and tracking of bugs using Jira.",
  "- Desenvolvimento e manutenção de testes automatizados para aplicações Web utilizando Robot Framework e Python.":"- Development and maintenance of automated tests for web applications using Robot Framework and Python.",
  "- Automação de testes para aplicações Android utilizando Appium integrado ao Robot Framework.":"- Test automation for Android applications using Appium integrated with Robot Framework.",
  "- Desenvolvimento de testes automatizados para APIs REST, validando requisições, respostas, autenticação e regras de negócio.":"- Development of automated tests for REST APIs, validating requests, responses, authentication, and business rules.",
  "- Evolução das suítes de testes automatizados, buscando ampliar a cobertura e aumentar a confiabilidade das validações.":"- Evolution of automated test suites, aiming to expand coverage and increase the reliability of validations.",
  "- Execução de testes automatizados em pipelines Jenkins, contribuindo para integração contínua e validação das entregas.":"- Execution of automated tests in Jenkins pipelines, contributing to continuous integration and validation of deliverables.",
  "- Utilização de Inteligência Artificial no fluxo de automação de testes, apoiando desde a análise de cenários e geração de ideias de testes até a implementação, revisão, otimização e manutenção de scripts.":"- Use of Artificial Intelligence in the test automation workflow, supporting everything from scenario analysis and test idea generation to script implementation, review, optimization, and maintenance.",
  "📅 2025 – Atual": "📅 2025 – Present",
  // WiseVAs
  "- Atuei na análise de requisitos, planejamento e execução de testes.":"- I worked on requirements analysis, planning, and test execution.",
  "- Auxiliei na atualização de documentação de testes, fluxos e regras identificadas para criar casos de teste, cenários e checklists baseados nas regras de negócio.":"- Assisted in updating test documentation, flows, and rules identified to create test cases, scenarios, and checklists based on business rules.",
  "- Mapeei e compreendi fluxos simples de gestão para apoiar decisões do time, analisar requisitos e levantar dúvidas para garantir clareza e entendimento.":"- I mapped out and understood simple management workflows to support team decisions, analyze requirements, and raise questions to ensure clarity and understanding.",
  "- Colaborei com o time para garantir entregas com qualidade e aprendizado contínuo.":"- I collaborated with the team to ensure quality deliverables and continuous learning.",
  "- Realizei testes manuais, funcionais e exploratórios para garantir a qualidade e a estabilidade das versões de software.":"- Conducted manual, functional, and exploratory tests to ensure the quality and stability of software versions.",
  "- Registrei de bugs de forma detalhada na plataforma Click Up, colaborando na priorização de correções com as equipes de desenvolvimento.":"- Logged detailed bug reports on the ClickUp platform, collaborating with development teams to prioritize fixes.",
  // INDT - Instituto de Desenvolvimento Tecnológico
  "- Realizei testes manuais, funcionais e exploratórios para garantir a qualidade e a estabilidade das versões de builds para Android.":"- Conducted manual, functional, and exploratory tests to ensure the quality and stability of Android build versions.",
  "- Realizei testes em builds Android customizadas para operadoras ATT, TMO e subsidiárias, assim como operadoras da América Latina.":"- I conducted tests on custom Android builds for carriers such as AT&T, T-Mobile, and their subsidiaries, as well as carriers in Latin America.",
  "- Executei testes automatizados Google como CTS, GTS, VTS e outros, validando builds para que as mesmas chegassem ao cliente final atendendo os requisitos google.":"- Executed automated Google tests such as CTS, GTS, VTS, and others, validating builds to ensure they met Google's requirements before reaching the end customer.",
  "- Executei testes automatizados usando framework interno otimizando o processo de validação e aumentando a eficiência das entregas.":"- Executed automated tests using an internal framework, optimizing the validation process and increasing delivery efficiency.",
  "- Registrei e documentei bugs detalhadamente nas plataformas Jira e Confluence, colaborando na priorização de correções com as equipes de desenvolvimento.":"- Logged and documented bugs in detail on Jira and Confluence, collaborating with development teams to prioritize fixes.",
  "- Participei da criação e edição de casos de teste, alinhando com os requisitos e cenários de usuário para garantir cobertura completa.":"- I participated in creating and editing test cases, aligning them with requirements and user scenarios to ensure complete coverage.",
  "- Apliquei metodologias ágeis, como Scrum e Kanban, para garantir a qualidade contínua do software, integrando os testes ao fluxo de desenvolvimento de forma colaborativa e eficiente.":"- I applied agile methodologies, such as Scrum and Kanban, to ensure continuous software quality, integrating testing into the development workflow in a collaborative and efficient manner.",
  // Educação
  "Educação": "Education",
  "Engenharia de Software": "Software Engineering",
  "Análise e Desenvolvimento de Sistemas": "Systems Analysis and Development",
  // Cursos
  "Cursos": "Courses",
  // Idiomas
  "Idiomas": "Languages",
  "Nível B1 - Conversação e Interpretação Textual": "Level B1 - Conversation and Textual Interpretation",
  "Inglês": "English",
  "Intermediário": "Intermediate",
  "Nativo": "Native",
  "Português": "Portuguese",
  "Fluente": "Fluent",
  "Ver mais": "View more",
  // Ferramentas
  "Ferramentas": "Tools",
  "Linguagem de Programação": "Programming Language",
  "Linguagem de Marcação": "Markup Language",
  "Linguagem de Estilo": "Style Language",
  "Controle de Versão": "Version Control",
  "Sistema Operacional": "Operating System",
  // Contato
  "Telefone": "Phone",
  "Este projeto pode ser visualizado com mais detalhes diretamente na respectiva página, contemplando códigos, tecnologias e implementações.": "This project can be viewed in more detail directly on its respective page, covering code, technologies, and implementations.",
  "Acessar Projeto": "Access Project",
  "Título": "Title",
  "Categoria": "Category",
  "Localizando...": "Locating...",
  "Visitante": "Visitor",
  "Aguardando...": "Waiting...",
  "Voltar ao topo": "Back to top",
  "Sem descrição": "No description",
  "Projeto no GitHub": "GitHub Project"
};

const reverseTranslations = {};
for (const [pt, en] of Object.entries(translations)) {
  reverseTranslations[en] = pt;
}

function translatePage(isEnglish) {
  const dict = isEnglish ? translations : reverseTranslations;
  
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walker.nextNode())) {
    const trimmed = node.nodeValue.trim();
    if (trimmed && dict[trimmed]) {
      node.nodeValue = node.nodeValue.replace(trimmed, dict[trimmed]);
    }
  }

  document.querySelectorAll('[aria-label]').forEach(el => {
    if (el.id === 'lang-toggle') return;
    const attr = el.getAttribute('aria-label').trim();
    if (dict[attr]) el.setAttribute('aria-label', dict[attr]);
  });
  document.querySelectorAll('[title]').forEach(el => {
    if (el.id === 'lang-toggle') return;
    const attr = el.getAttribute('title').trim();
    if (dict[attr]) el.setAttribute('title', dict[attr]);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('lang-toggle');
  const langTooltip = document.getElementById('lang-tooltip');
  const langTooltipClose = document.getElementById('lang-tooltip-close');
  const darkmodeTooltip = document.getElementById('darkmode-tooltip');
  const darkmodeTooltipClose = document.getElementById('darkmode-tooltip-close');
  let isEnglish = false;

  if (langTooltip) {
    setTimeout(() => {
      langTooltip.classList.add('show');
    }, 700);
  }

  let darkmodeTooltipShown = false;

  const dismissTooltip = () => {
    if (langTooltip && langTooltip.classList.contains('show')) {
      langTooltip.classList.remove('show');
      
      if (darkmodeTooltip && !darkmodeTooltipShown) {
        darkmodeTooltipShown = true;
        setTimeout(() => {
          darkmodeTooltip.classList.add('show');
        }, 1000);
      }
    }
  };

  if (langTooltipClose) {
    langTooltipClose.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissTooltip();
    });
  }

  const dismissDarkmodeTooltip = () => {
    darkmodeTooltipShown = true; 
    if (darkmodeTooltip && darkmodeTooltip.classList.contains('show')) {
      darkmodeTooltip.classList.remove('show');
    }
  };

  if (darkmodeTooltipClose) {
    darkmodeTooltipClose.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissDarkmodeTooltip();
    });
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      dismissTooltip();

      isEnglish = !isEnglish;
      langToggle.classList.toggle('active', isEnglish);
      langToggle.setAttribute('aria-label', isEnglish ? 'Translate to Portuguese' : 'Translate to English');
      langToggle.setAttribute('title', isEnglish ? 'Translate to Portuguese' : 'Translate to English');
      translatePage(isEnglish);
    });
  }

  // --- Space Mode Logic ---
  const spaceToggle = document.getElementById('space-toggle');
  let isSpaceMode = false;

  if (spaceToggle) {
    spaceToggle.addEventListener('click', () => {
      dismissDarkmodeTooltip();
      if (langTooltip) langTooltip.classList.remove('show');

      isSpaceMode = !isSpaceMode;
      document.body.classList.toggle('space-mode', isSpaceMode);
      spaceToggle.classList.toggle('active', isSpaceMode);
      initSpaceCanvas();
    });
  }
  initSpaceCanvas();
});

function initSpaceCanvas() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  
  // Parallax variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX - width / 2) / (width / 2);
    targetY = (e.clientY - height / 2) / (height / 2);
  });
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -50) this.x = width + 50;
      if (this.x > width + 50) this.x = -50;
      if (this.y < -50) this.y = height + 50;
      if (this.y > height + 50) this.y = -50;
    }
  }

  function init() {
    particles = [];
    const numParticles = Math.min(Math.floor(window.innerWidth / 10), 120);
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      
      const pX = particles[i].x + (mouseX * particles[i].size * 25);
      const pY = particles[i].y + (mouseY * particles[i].size * 25);
      
      ctx.globalAlpha = particles[i].opacity;
      const isDark = document.body.classList.contains('space-mode');
      ctx.fillStyle = isDark ? '#ffffff' : '#111111';
      ctx.beginPath();
      ctx.arc(pX, pY, particles[i].size, 0, Math.PI * 2);
      ctx.fill();
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2X = particles[j].x + (mouseX * particles[j].size * 25);
        const p2Y = particles[j].y + (mouseY * particles[j].size * 25);
        
        const dx = pX - p2X;
        const dy = pY - p2Y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          const maxLineOpacity = isDark ? 0.15 : 0.4;
          ctx.globalAlpha = (120 - dist) / 120 * maxLineOpacity;
          ctx.strokeStyle = isDark ? '#ffffff' : '#111111';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(pX, pY);
          ctx.lineTo(p2X, p2Y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();
}

async function loadGitHubProjects() {
  const container = document.getElementById('github-projects-container');
  if (!container) return;

  const githubUsername = 'eliasramiresjr';
  const url = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12`;

  const repositoriosIgnorados = [
    'eliasramiresjr.github.io'
  ];

  try {
    const response = await fetch(url);
    const repos = await response.json();
    
    container.innerHTML = '';

    const activeRepos = repos
      .filter(repo => !repo.fork && !repositoriosIgnorados.includes(repo.name))
      .slice(0, 8);

    activeRepos.forEach(repo => {
      const card = document.createElement('a');
      card.className = 'project-card';
      card.href = repo.html_url;
      card.target = '_blank';

      let formattedName = repo.name.replace(/-/g, ' ');
      formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);

      card.innerHTML = `
        <div class="project-img">
          <div class="aesthetic-bg">
            <div class="aesthetic-glow"></div>
            <div class="aesthetic-grid"></div>
            <div class="aesthetic-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
          </div>
        </div>
        <div class="project-info">
          <div>
            <div class="project-name">${formattedName}</div>
            <div class="project-cat">${repo.description ? repo.description : 'Sem descrição'}</div>
          </div>
          <span class="project-arrow">↗</span>
        </div>
      `;

      container.appendChild(card);
    });

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle && langToggle.classList.contains('active')) {
      translatePage(true);
    }

  } catch (error) {
    console.error('Erro ao buscar repositórios do GitHub', error);
    container.innerHTML = '<p style="color: red; text-align: center; grid-column: 1 / -1;">Erro ao carregar projetos do GitHub.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadGitHubProjects();

  const viewMoreBtn = document.getElementById('view-more-projects-btn');
  const projectsWrapper = document.getElementById('projects-wrapper');

  if (viewMoreBtn && projectsWrapper) {
    viewMoreBtn.addEventListener('click', () => {
      // Pega a altura real do conteúdo
      const scrollHeight = projectsWrapper.scrollHeight;
      
      // Aplica a transição diretamente via JavaScript (bem lenta e suave)
      projectsWrapper.style.transition = 'max-height 1.5s ease-in-out';
      projectsWrapper.style.maxHeight = scrollHeight + 'px';
      
      projectsWrapper.classList.remove('collapsed');

      const overlay = document.getElementById('projects-overlay');
      if (overlay) {
        // Faz o overlay do botão sumir lentamente também
        overlay.style.transition = 'opacity 1s ease-in-out';
        overlay.style.opacity = '0';
        
        setTimeout(() => {
          overlay.style.display = 'none';
          // Limpa a restrição de altura depois da animação para manter o layout flexível
          projectsWrapper.style.maxHeight = 'none';
        }, 1500); 
      }
    });
  }
});

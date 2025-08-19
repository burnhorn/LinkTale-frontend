// src/lib/mockData.ts
import type { ChartConfiguration } from 'chart.js';
import type { StoryBook, Plan, Faq, WorldAsset } from '$lib/types';
import type { IconName } from '$lib/icons';

// from src/routes/admin/+page.server.ts
export const kpiData = {
  dau: { value: '1,284', change: '+12.5%', isPositive: true, label: "일일 활성 사용자" },
  newSignups: { value: '97', change: '+8.2%', isPositive: true, label: "신규 가입자" },
  revenue: { value: '₩450,300', change: '-2.1%', isPositive: false, label: "일일 매출" },
  storiesCreated: { value: '312', change: '+22.0%', isPositive: true, label: "이야기 생성 수" },
};

export const mainFunnelData: ChartConfiguration = {
  type: 'bar',
  data: {
    labels: ['방문', '가입', '첫 이야기 시작', '첫 이야기 완성', '재방문'],
    datasets: [{
        label: '사용자 수',
        data: [10000, 1284, 980, 450, 600],
        backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(34, 197, 94, 0.7)',
            'rgba(234, 179, 8, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(168, 85, 247, 0.7)',
        ],
        borderWidth: 0
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
      y: { ticks: { color: '#94a3b8' }, grid: { display: false } }
    }
  }
};

export const hourlyActiveUsersData: ChartConfiguration = {
  type: 'line',
  data: {
    labels: Array.from({length: 24}, (_, i) => `${i}시`),
    datasets: [{
        label: '활성 사용자',
        data: [10, 8, 12, 20, 35, 50, 60, 75, 90, 110, 120, 115, 100, 95, 130, 150, 180, 250, 300, 280, 220, 150, 80, 40],
        fill: true,
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        tension: 0.4,
        pointRadius: 0,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
    }
  }
};

// from src/routes/admin/users/+page.server.ts
export const users = [
  { id: 1, email: 'user1@example.com', nickname: '모험가 레오', lastSeen: '2시간 전', stories: 5, spend: '₩29,800' },
  { id: 2, email: 'user2@example.com', nickname: '탐정 제인', lastSeen: '1일 전', stories: 2, spend: '₩0' },
  { id: 3, email: 'user3@example.com', nickname: '코미디언 잭', lastSeen: '5분 전', stories: 12, spend: '₩14,900' },
  { id: 4, email: 'user4@example.com', nickname: '닥터 크로노', lastSeen: '3일 전', stories: 1, spend: '₩4,900' },
  { id: 5, email: 'user5@example.com', nickname: '캡틴 네모', lastSeen: '1주 전', stories: 8, spend: '₩59,600' },
];

const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}).reverse();

export const retentionData = {
  labels: last7Days,
  datasets: [
      {
          type: 'bar' as const,
          label: '신규 가입자',
          data: [65, 59, 80, 81, 56, 90, 97],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          order: 2,
      },
      {
          type: 'line' as const,
          label: '재방문율 (%)',
          data: [45, 42, 55, 60, 48, 58, 62],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y1',
          order: 1,
      },
  ],
};

export const userActionsData: ChartConfiguration = {
  type: 'doughnut',
  data: {
    labels: ['이미지 생성', '공유하기', '퀘스트 완료', '책장 저장', '기타'],
    datasets: [{
        label: '이벤트 수',
        data: [300, 150, 100, 200, 50],
        backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: '#1f2937',
        borderWidth: 2,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8' }
      }
    }
  }
};

// from src/routes/admin/content/+page.server.ts
export const mockBooks: StoryBook[] = [
  { id: 'book-1', title: '아리와의 첫 만남', authorName: '모험가 레오', coverImageUrl: 'https://images.unsplash.com/photo-1581092919533-22b5c3527a13?q=80&w=2070&auto=format&fit=crop', likes: 1250, views: 8520, tags: ['#로봇', '#우정', '#감동'], summary: '별빛 소녀와 AI 로봇의 만남', pages: [], createdAt: new Date(), isMasterpiece: true, mainCharacters: ['루아', '아리'], creationHistory: [] },
  { id: 'book-2', title: '사라진 별빛 펜던트', authorName: '탐정 제인', coverImageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop', likes: 830, views: 4500, tags: ['#추리', '#모험', '#미스터리'], summary: '사라진 펜던트를 찾는 추리 모험', pages: [], createdAt: new Date(), isMasterpiece: false, mainCharacters: ['루아', '아리'], creationHistory: [] },
  { id: 'book-3', title: '웃지 않는 왕국의 비밀', authorName: '이야기꾼 샘', coverImageUrl: 'https://images.unsplash.com/photo-1565347523940-32134aa3a682?q=80&w=2070&auto=format&fit=crop', likes: 980, views: 6100, tags: ['#판타지', '#마법', '#감동'], summary: '웃음을 되찾기 위한 여정', pages: [], createdAt: new Date(), isMasterpiece: false, mainCharacters: ['루아', '아리'], creationHistory: [] },
  { id: 'book-4', title: '시간을 여행하는 기차', authorName: '닥터 크로노', coverImageUrl: 'https://images.unsplash.com/photo-1534790566855-4cb788d389ec?q=80&w=2070&auto=format&fit=crop', likes: 450, views: 2200, tags: ['#SF', '#시간여행', '#코미디'], summary: '과거와 미래를 넘나드는 모험', pages: [], createdAt: new Date(), isMasterpiece: false, mainCharacters: ['루아', '아리'], creationHistory: [] },
  { id: 'book-5', title: '심해의 노래하는 등대', authorName: '캡틴 네모', coverImageUrl: 'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?q=80&w=2070&auto=format&fit=crop', likes: 710, views: 3800, tags: ['#모험', '#바다', '#미스터리'], summary: '바닷속 등대의 비밀', pages: [], createdAt: new Date(), isMasterpiece: false, mainCharacters: ['루아', '아리'], creationHistory: [] },
  { id: 'book-6', title: '배꼽 잡는 코미디 쇼', authorName: '코미디언 잭', coverImageUrl: 'https://images.unsplash.com/photo-1549619846-869b39e2095c?q=80&w=1932&auto=format&fit=crop', likes: 680, views: 3100, tags: ['#코미디', '#유머'], summary: '마을 축제의 대소동', pages: [], createdAt: new Date(), isMasterpiece: false, mainCharacters: ['원숭이', '마법사'], creationHistory: [] }
];

export const contentKpis = {
  totalStories: { value: '1,234', change: '+50', isPositive: true, label: "총 이야기 수" },
  avgRating: { value: '4.8/5', change: '+0.1', isPositive: true, label: "평균 별점" },
  completionRate: { value: '72%', change: '-1%', isPositive: false, label: "이야기 완성률" },
};

export const wordCloudData: ChartConfiguration = {
  type: 'wordCloud',
  data: {
    labels: ["로봇", "공주", "마법", "우정", "모험", "용", "성", "비밀", "학교", "친구", "동물", "요정", "왕국", "보물", "악당", "슈퍼히어로"],
    datasets: [{
      label: '키워드',
      data: [90, 80, 75, 70, 68, 65, 60, 50, 40, 30, 25, 15, 45, 55, 62, 78],
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
  }
};

export const aiAgentPreferenceData: ChartConfiguration = {
  type: 'pie',
  data: {
      labels: ['스토리 작가', '일러스트레이터', '아이디어 제안'],
      datasets: [{
          label: '상호작용 횟수',
          data: [520, 310, 170],
          backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(234, 179, 8, 0.8)',
              'rgba(16, 185, 129, 0.8)'
          ],
          borderColor: '#1f2937', // bg-slate-800
          borderWidth: 2,
      }]
  },
  options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: {
              position: 'bottom',
              labels: { color: '#cbd5e1' }
          }
      }
  }
};

export const popularPlazaPostsData = [...mockBooks].sort((a,b) => b.likes - a.likes).slice(0,10);

// from src/routes/admin/revenue/+page.server.ts
export const revenueData = {
  monthlyRevenue: 52300,
  revenueBySource: [
    { source: 'Organic Search', value: 22300 },
    { source: 'Paid Ads', value: 15000 },
    { source: 'Direct', value: 10000 },
    { source: 'Referral', value: 5000 },
  ],
  topSellingProducts: [
    { id: 'prod_1', name: 'Adventure Story Pack', sales: 150, revenue: 15000 },
    { id: 'prod_2', name: 'Sci-Fi World Builder', sales: 120, revenue: 12000 },
    { id: 'prod_3', name: 'Fantasy Character Set', sales: 95, revenue: 9500 },
    { id: 'prod_4', name: 'Interactive Mystery Novel', sales: 80, revenue: 8000 },
  ],
};

// from src/routes/(app)/bookshelf/+page.server.ts
export const bookshelfBooks: StoryBook[] = [
  { 
    id: '1', 
    title: '별빛 용의 전설', 
    summary: '용감한 용과 함께 떠나는 마법의 여정. 별빛을 되찾기 위한 모험이 펼쳐집니다.',
    coverImageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887&auto=format&fit=crop', 
    isMasterpiece: true,
    createdAt: new Date('2023-10-26T10:00:00Z'),
    pages: Array(12).fill(0),
    mainCharacters: ['아리', '용용이'],
    creationHistory: [
      { sender: 'user', text: '용에 대한 이야기를 만들어줘' },
      { sender: 'ai', text: '옛날 옛적, 별빛을 먹고 사는 용이 살았어요.' }
    ],
    authorName: 'AI 공학자',
    likes: 990,
    views: 8100,
    tags: ['SF', '우정', '로봇', '감동']
  },
  { 
    id: '2', 
    title: '시간을 걷는 소녀', 
    summary: '과거와 미래를 넘나드는 소녀의 신비한 능력. 시간을 되돌려 소중한 것을 지켜낼 수 있을까?',
    coverImageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop', 
    isMasterpiece: false,
    createdAt: new Date('2023-11-15T14:30:00Z'),
    pages: Array(20).fill(0),
    mainCharacters: ['하루', '미래'],
    creationHistory: [],
    authorName: '용 사냥꾼',
    likes: 1150,
    views: 9300,
    tags: ['모험', '판타지', '드래곤', '액션']
  },
  { 
    id: '3', 
    title: '마법의 숲과 비밀의 문', 
    summary: '평범한 소년이 우연히 발견한 비밀의 문. 그 너머에는 놀라운 마법의 숲이 펼쳐진다.',
    coverImageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop', 
    isMasterpiece: false,
    createdAt: new Date('2024-01-20T09:00:00Z'),
    pages: Array(15).fill(0),
    mainCharacters: ['레오', '티나'],
    creationHistory: [],
    authorName: '탐험가 제독',
    likes: 1204,
    views: 8500,
    tags: ['모험', '판타지', '해저', '미스터리', '감동']
  },
  { 
    id: '4', 
    title: '유령 도서관의 속삭임', 
    summary: '밤마다 책들이 살아 움직이는 도서관. 그곳의 비밀을 파헤치는 어린 사서의 이야기.',
    coverImageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1856&auto=format&fit=crop', 
    isMasterpiece: false,
    createdAt: new Date('2024-02-10T11:00:00Z'),
    pages: Array(18).fill(0),
    mainCharacters: ['엘라', '유령'],
    creationHistory: [],
    authorName: '사서 할머니',
    likes: 780,
    views: 5500,
    tags: ['미스터리', '유령', '책']
  },
  { 
    id: '5', 
    title: '초콜릿 강의 모험', 
    summary: '모든 것이 초콜릿으로 이루어진 강을 따라 떠나는 달콤하고 위험한 모험.',
    coverImageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1987&auto=format&fit=crop', 
    isMasterpiece: false,
    createdAt: new Date('2024-03-05T16:00:00Z'),
    pages: Array(25).fill(0),
    mainCharacters: ['찰리', '윌리'],
    creationHistory: [],
    authorName: '제과사 파티시에',
    likes: 1800,
    views: 15000,
    tags: ['판타지', '모험', '음식']
  },
];

// from src/routes/(app)/pricing/+page.server.ts
export const plans: Plan[] = [
  {
    iconName: 'rocket' as IconName,
    title: 'Freemium',
    description: '기본 기능 제공',
    price: '무료',
    benefits: ['기본 동화 1권 무료 생성', '기본 텍스트-이미지 생성', '동화 PDF 다운로드'],
    cta: '현재 플랜',
    isCurrent: true,
    colors: {
      bg: 'bg-blue-900/30',
      iconBg: 'bg-blue-500/20',
      priceBg: 'bg-blue-500/30 text-blue-200',
      ctaBg: '',
      ctaHoverBg: '',
      ctaText: ''
    }
  },
  {
    iconName: 'refreshCw' as IconName,
    title: '스파크 플랜',
    description: '핵심 기능 제공',
    price: '월 14,900원~',
    benefits: [
      '무제한 동화 생성',
      '✨ 더 아름다운 프리미엄 그림체 무제한',
      '2인극 드라마 및 배경음악 다운로드',
      '모든 기능 무제한 이용'
    ],
    cta: '14일 무료 체험 시작하기',
    isPopular: true,
    subtext: '언제든 쉽게 해지할 수 있어요.',
    colors: {
      bg: 'bg-violet-900/30',
      iconBg: 'bg-violet-500/20',
      priceBg: 'bg-violet-500/30 text-violet-200',
      ctaBg: 'bg-violet-600',
      ctaHoverBg: 'hover:bg-violet-700',
      ctaText: 'text-white'
    }
  },
  {
    iconName: 'fileText' as IconName,
    title: '크레딧 팩',
    description: '특별한 기능 제공',
    price: '4,900원~',
    benefits: ['실물 하드커버 동화책 제작/배송', '특별 테마 및 캐릭터 팩 구매', '생일/기념일 맞춤 선물 패키지'],
    cta: '필요할 때 충전하기',
    colors: {
      bg: 'bg-green-900/30',
      iconBg: 'bg-green-500/20',
      priceBg: 'bg-green-500/30 text-green-200',
      ctaBg: 'bg-green-600',
      ctaHoverBg: 'hover:bg-green-700',
      ctaText: 'text-white'
    }
  }
];

export const faqs: Faq[] = [
  {
    q: '크레딧은 무엇이고, 어디에 사용되나요?',
    a: '크레딧은 실물 동화책을 주문하거나, 특별한 캐릭터 팩, 새로운 그림 스타일 등을 구매하는 데 사용되는 재화입니다. 구독 플랜과 별개로 필요할 때마다 충전하여 사용할 수 있습니다.'
  },
  {
    q: '구독하면 지금 만든 동화책도 업그레이드되나요?',
    a: '네, 그렇습니다! 스파크 플랜을 구독하시면 기존에 Freemium으로 만드셨던 동화책에도 프리미엄 그림체를 적용하거나, 오디오 드라마를 생성하는 등 모든 기능을 사용하실 수 있습니다.'
  },
  {
    q: '실물 책 배송은 얼마나 걸리나요?',
    a: '주문 제작 상품으로, 주문 완료 후 제작에 약 3-5 영업일이 소요되며, 배송은 지역에 따라 추가로 1-3 영업일이 소요될 수 있습니다. 기념일 선물 등 특별한 날짜에 맞추시려면 여유 있게 주문해 주세요.'
  }
];

// from src/routes/(app)/adventure/+page.server.ts
export const adventureBooks: StoryBook[] = [
  { 
    id: 'adv1', 
    title: '해저 왕국 탐험', 
    summary: '신비로운 해저 도시 아틀란티스의 비밀을 파헤쳐보세요. 고대 유물과 숨겨진 이야기를 찾아 떠나는 모험.',
    coverImageUrl: 'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?q=80&w=2070&auto=format&fit=crop', 
    isMasterpiece: true,
    createdAt: new Date('2024-03-15T10:00:00Z'),
    pages: Array(25).fill(0),
    mainCharacters: ['카이', '마리나'],
    creationHistory: [],
    authorName: '탐험가 제독',
    likes: 1204,
    views: 8500,
    tags: ['모험', '판타지', '해저', '미스터리', '감동']
  },
  { 
    id: 'adv2', 
    title: '하늘섬 구출 작전', 
    summary: '떠다니는 섬 라퓨타에 갇힌 친구들을 구출하는 스팀펑크 모험. 비행선과 기계 장치들이 가득합니다.',
    coverImageUrl: 'https://plus.unsplash.com/premium_vector-1725285394622-af12d0b2434c?q=80&w=722&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    isMasterpiece: false,
    createdAt: new Date('2024-02-20T14:30:00Z'),
    pages: Array(30).fill(0),
    mainCharacters: ['핀', '에이미'],
    creationHistory: [],
    authorName: '발명가 에디',
    likes: 980,
    views: 7200,
    tags: ['모험', '스팀펑크', '우정', '로봇']
  },
  { 
    id: 'adv3', 
    title: '드래곤의 산맥', 
    summary: '전설의 드래곤이 잠들어 있다는 위험한 산맥을 탐험하세요. 용의 불을 피하고 보물을 차지할 수 있을까요?',
    coverImageUrl: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    isMasterpiece: false,
    createdAt: new Date('2024-03-01T09:00:00Z'),
    pages: Array(22).fill(0),
    mainCharacters: ['아라', '발두르'],
    creationHistory: [],
    authorName: '용 사냥꾼',
    likes: 1150,
    views: 9300,
    tags: ['모험', '판타지', '드래곤', '액션']
  },
   { 
    id: 'adv4', 
    title: '마법 상점의 비밀', 
    summary: '평범한 골목에 숨겨진 신비한 마법 상점. 그곳의 주인과 함께 잃어버린 유물을 찾아 나서는 이야기.',
    coverImageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop', 
    isMasterpiece: false,
    createdAt: new Date('2024-01-10T18:00:00Z'),
    pages: Array(18).fill(0),
    mainCharacters: ['엘리', '올리버'],
    creationHistory: [],
    authorName: '마법사 멀린',
    likes: 850,
    views: 6500,
    tags: ['판타지', '미스터리', '마법', '감동']
  },
  { 
    id: 'adv5', 
    title: '은하수를 여행하는 기차', 
    summary: '밤하늘의 은하수를 따라 달리는 신비한 기차. 각 역마다 새로운 별과 새로운 친구들을 만납니다.',
    coverImageUrl: 'https://images.unsplash.com/photo-1534790566855-4cb788d389ec?q=80&w=2070&auto=format&fit=crop', 
    isMasterpiece: false,
    createdAt: new Date('2023-12-25T20:00:00Z'),
    pages: Array(40).fill(0),
    mainCharacters: ['미로', '별'],
    creationHistory: [],
    authorName: '은하철도 기관사',
    likes: 1500,
    views: 12000,
    tags: ['판타지', '여행', '우정', '감동']
  },
  { 
    id: 'adv6', 
    title: '로봇 친구와 함께', 
    summary: '외로운 소년에게 찾아온 인공지능 로봇. 둘은 진짜 친구가 될 수 있을까요?',
    coverImageUrl: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    isMasterpiece: false,
    createdAt: new Date('2024-03-10T11:00:00Z'),
    pages: Array(15).fill(0),
    mainCharacters: ['토미', '유닛734'],
    creationHistory: [],
    authorName: 'AI 공학자',
    likes: 990,
    views: 8100,
    tags: ['SF', '우정', '로봇', '감동']
  },
  { 
    id: 'adv7', 
    title: '정글의 심장', 
    summary: '전설 속 황금 도시를 찾아 아마존 정글 깊숙한 곳으로 떠나는 탐험대의 이야기.',
    coverImageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2175&auto=format&fit=crop', 
    isMasterpiece: false,
    createdAt: new Date('2024-04-01T12:00:00Z'),
    pages: Array(35).fill(0),
    mainCharacters: ['잭', '일라'],
    creationHistory: [],
    authorName: '고고학자 존스',
    likes: 1300,
    views: 11000,
    tags: ['모험', '정글', '보물']
  },
  { 
    id: 'adv8', 
    title: '사막의 모래 폭풍', 
    summary: '모래 폭풍 속에 숨겨진 고대 오아시스를 찾아 떠나는 캐러밴의 여정.',
    coverImageUrl: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2070&auto=format&fit=crop', 
    isMasterpiece: false,
    createdAt: new Date('2024-04-15T08:00:00Z'),
    pages: Array(28).fill(0),
    mainCharacters: ['자라', '카심'],
    creationHistory: [],
    authorName: '사막의 유목민',
    likes: 1050,
    views: 8900,
    tags: ['모험', '사막', '생존']
  },
];

// from src/routes/(app)/encyclopedia/+page.server.ts
export const encyclopediaItems: WorldAsset[] = [
  { 
    id: 'char1', 
    name: '에단', 
    category: 'character', 
    summary: '별빛 용의 전설의 용감한 주인공.', 
    description: '따뜻한 마음씨를 가졌지만, 때로는 무모할 정도로 용감하다. 고대 유물에 대한 해박한 지식을 가지고 있으며, 동료들을 이끄는 리더십을 발휘한다.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
    createdAt: new Date('2024-03-10T10:00:00Z'),
    appearanceHistory: [
      { storyTitle: '별빛 용의 전설', pageNumber: 1 },
      { storyTitle: '속삭이는 숲의 비밀', pageNumber: 5 },
    ]
  },
  { 
    id: 'loc1', 
    name: '속삭이는 숲', 
    category: 'place', 
    summary: '고대 정령들이 살고 있는 신비로운 숲.', 
    description: '밤이 되면 나무들이 서로 소곤거린다고 전해진다. 숲의 중심부에는 모든 것을 치유하는 샘이 있다고 알려져 있지만, 그곳에 도달한 사람은 아무도 없다.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop',
    createdAt: new Date('2024-03-05T14:30:00Z'),
    appearanceHistory: [
      { storyTitle: '속삭이는 숲의 비밀', pageNumber: 1 },
    ]
  },
  { 
    id: 'item1', 
    name: '시간의 나침반', 
    category: 'item', 
    summary: '시간을 되돌리거나 미래를 볼 수 있는 유물.', 
    description: '오직 순수한 마음을 가진 자만이 사용할 수 있으며, 잘못 사용하면 시간의 흐름을 뒤엉키게 만들 수 있는 위험한 물건이다.',
    imageUrl: 'https://images.unsplash.com/photo-1516503424803-708327384b90?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    createdAt: new Date('2024-02-20T09:00:00Z'),
    appearanceHistory: [
      { storyTitle: '시간을 걷는 소녀', pageNumber: 12 },
    ]
  },
  { 
    id: 'char2', 
    name: '릴리', 
    category: 'character', 
    summary: '시간을 걷는 소녀의 신비로운 동반자.', 
    description: '미래를 예지하는 능력을 가지고 있으며, 항상 알 수 없는 미소를 띠고 있다. 그녀의 진짜 정체는 아무도 모른다.',
    imageUrl: 'https://images.unsplash.com/photo-1601830976337-e32f60eba315?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    createdAt: new Date('2024-02-15T18:00:00Z'),
    appearanceHistory: [
      { storyTitle: '시간을 걷는 소녀', pageNumber: 2 },
      { storyTitle: '떠다니는 시장의 상인', pageNumber: 8 },
    ]
  },
];


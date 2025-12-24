import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LanguageState {
  currentLanguage: string
  translations: Record<string, Record<string, string>>
}

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.missions': 'Missions',
    'nav.badges': 'Badges',
    'nav.leaderboard': 'Leaderboard',
    'nav.profile': 'Profile',
    'dashboard.volunteerHours': 'Volunteer Hours Completed',
    'dashboard.growth': 'month over month',
    'dashboard.viewBadges': 'View Badges & Milestones',
    'dashboard.hoursStatement': 'Volunteer Hours Statement',
    'dashboard.leaderboard': 'Leaderboard',
    'dashboard.viewAll': 'View All',
    'dashboard.you': 'You',
    'dashboard.hours': 'hours',
    'stats.totalHours': 'Total Hours',
    'stats.projects': 'Projects Completed',
    'stats.organizations': 'Organizations Helped',
    'stats.rating': 'Average Rating',
    'badges.title': 'Badges & Milestones',
    'badges.description': 'Earn certificates, medals, and milestones based on your volunteer hours. Apply for official recognition from partner organizations.',
    'badges.earned': 'Badges Earned',
    'badges.totalHours': 'Total Hours',
    'badges.nextBadge': 'Hours to Next Badge',
    'badges.allEarned': 'All Badges Earned!',
    'badges.all': 'All Badges',
    'badges.milestones': 'Milestones',
    'badges.certificates': 'Certificates',
    'badges.medals': 'Medals',
    'badges.earnedOn': 'Earned on',
    'badges.applyCertificate': 'Apply for Certificate',
    'badges.claimMedal': 'Claim Medal',
    'badges.moreHours': 'more hours needed'
  },
  id: {
    'nav.home': 'Beranda',
    'nav.missions': 'Misi',
    'nav.badges': 'Lencana',
    'nav.leaderboard': 'Papan Peringkat',
    'nav.profile': 'Profil',
    'dashboard.volunteerHours': 'Jam Sukarela Selesai',
    'dashboard.growth': 'bulan ke bulan',
    'dashboard.viewBadges': 'Lihat Lencana & Pencapaian',
    'dashboard.hoursStatement': 'Laporan Jam Sukarela',
    'dashboard.leaderboard': 'Papan Peringkat',
    'dashboard.viewAll': 'Lihat Semua',
    'dashboard.you': 'Anda',
    'dashboard.hours': 'jam',
    'stats.totalHours': 'Total Jam',
    'stats.projects': 'Proyek Selesai',
    'stats.organizations': 'Organisasi Dibantu',
    'stats.rating': 'Rating Rata-rata',
    'badges.title': 'Lencana & Pencapaian',
    'badges.description': 'Dapatkan sertifikat, medali, dan pencapaian berdasarkan jam sukarela Anda. Ajukan pengakuan resmi dari organisasi mitra.',
    'badges.earned': 'Lencana Diperoleh',
    'badges.totalHours': 'Total Jam',
    'badges.nextBadge': 'Jam ke Lencana Berikutnya',
    'badges.allEarned': 'Semua Lencana Diperoleh!',
    'badges.all': 'Semua Lencana',
    'badges.milestones': 'Pencapaian',
    'badges.certificates': 'Sertifikat',
    'badges.medals': 'Medali',
    'badges.earnedOn': 'Diperoleh pada',
    'badges.applyCertificate': 'Ajukan Sertifikat',
    'badges.claimMedal': 'Klaim Medali',
    'badges.moreHours': 'jam lagi diperlukan'
  },
  'zh-cn': {
    'nav.home': '首页',
    'nav.missions': '任务',
    'nav.badges': '徽章',
    'nav.leaderboard': '排行榜',
    'nav.profile': '个人资料',
    'dashboard.volunteerHours': '志愿服务小时完成',
    'dashboard.growth': '月环比',
    'dashboard.viewBadges': '查看徽章和里程碑',
    'dashboard.hoursStatement': '志愿服务小时报表',
    'dashboard.leaderboard': '排行榜',
    'dashboard.viewAll': '查看全部',
    'dashboard.you': '您',
    'dashboard.hours': '小时',
    'stats.totalHours': '总小时数',
    'stats.projects': '完成项目',
    'stats.organizations': '帮助组织',
    'stats.rating': '平均评分',
    'badges.title': '徽章和里程碑',
    'badges.description': '根据您的志愿服务小时获得证书、奖章和里程碑。申请合作组织的官方认可。',
    'badges.earned': '获得徽章',
    'badges.totalHours': '总小时数',
    'badges.nextBadge': '距离下一个徽章的小时数',
    'badges.allEarned': '所有徽章已获得！',
    'badges.all': '所有徽章',
    'badges.milestones': '里程碑',
    'badges.certificates': '证书',
    'badges.medals': '奖章',
    'badges.earnedOn': '获得于',
    'badges.applyCertificate': '申请证书',
    'badges.claimMedal': '领取奖章',
    'badges.moreHours': '还需要更多小时'
  },
  'zh-tw': {
    'nav.home': '首頁',
    'nav.missions': '任務',
    'nav.badges': '徽章',
    'nav.leaderboard': '排行榜',
    'nav.profile': '個人資料',
    'dashboard.volunteerHours': '志願服務小時完成',
    'dashboard.growth': '月環比',
    'dashboard.viewBadges': '查看徽章和里程碑',
    'dashboard.hoursStatement': '志願服務小時報表',
    'dashboard.leaderboard': '排行榜',
    'dashboard.viewAll': '查看全部',
    'dashboard.you': '您',
    'dashboard.hours': '小時',
    'stats.totalHours': '總小時數',
    'stats.projects': '完成項目',
    'stats.organizations': '幫助組織',
    'stats.rating': '平均評分',
    'badges.title': '徽章和里程碑',
    'badges.description': '根據您的志願服務小時獲得證書、獎章和里程碑。申請合作組織的官方認可。',
    'badges.earned': '獲得徽章',
    'badges.totalHours': '總小時數',
    'badges.nextBadge': '距離下一個徽章的小時數',
    'badges.allEarned': '所有徽章已獲得！',
    'badges.all': '所有徽章',
    'badges.milestones': '里程碑',
    'badges.certificates': '證書',
    'badges.medals': '獎章',
    'badges.earnedOn': '獲得於',
    'badges.applyCertificate': '申請證書',
    'badges.claimMedal': '領取獎章',
    'badges.moreHours': '還需要更多小時'
  }
}

const initialState: LanguageState = {
  currentLanguage: 'en',
  translations
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload
    }
  }
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer
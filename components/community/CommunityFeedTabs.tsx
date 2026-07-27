// [已下线] · spec §五 明确要求"顶部只保留三个主 Tab · 博客 / 帖子 / 动态"
// 保留组件签名以避免大规模调用点回归 · 但渲染为 null
// 3-tab 主导航由 WhisperSquareHero + CommunityModeSwitcher 提供

interface Props {
  unansweredCount?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CommunityFeedTabs(_props: Props): null {
  return null;
}

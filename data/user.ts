export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  links: Link[];
}

export const userData: UserProfile = {
  username: "류찬휘",
  displayName: "chanwhee",
  bio: "본인만의 통합 링크 페이지가 필요한 크리에이터 류찬휘입니다. 반갑습니다!",
  links: [
    {
      id: "1",
      title: "인스타그램",
      url: "https://www.instagram.com/",
      icon: "instagram",
    },
    {
      id: "2",
      title: "유튜브",
      url: "https://www.youtube.com/",
      icon: "youtube",
    },
    {
      id: "3",
      title: "블로그",
      url: "https://section.blog.naver.com/",
      icon: "rss",
    },
    {
      id: "4",
      title: "GitHub",
      url: "https://github.com/",
      icon: "github",
    },
    {
      id: "5",
      title: "포트폴리오",
      url: "https://portfolio.com/",
      icon: "briefcase",
    },
  ],
};

export const sections = [
  { title: "Daily Report", url: "daily_report" },
  { title: "News", url: "news" },
  { title: "Finance", url: "finance" },
  { title: "Trading", url: "trading" },
  { title: "Forex", url: "forex" },
  { title: "Future", url: "future" },
  { title: "Science", url: "science" },
  { title: "Task", url: "task" },
  { title: "Diary", url: "diary" },
  { title: "Note", url: "note" },
];

export const getTitle = url => {
  const title = sections.find(section => section.url == url).title;

  return (title === 'Daily Report') ? title : title + " Blog";

}
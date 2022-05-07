import * as fs from 'fs';
export function writeSidebar(navigation: any, outputDirectory: string) {
  const parseUrl = (url: string) => '../wiki/' + url.replace('.md', '');
  const navJson: string[] = [`## ${navigation.title}\n`];
  const allowedSections = ['Home', 'Modules', 'Namespaces'];
  navigation.children
    ?.filter(
      (navItem) => !navItem.isLabel || allowedSections.includes(navItem.title),
    )
    .forEach((navItem) => {
      if (navItem.isLabel) {
        navJson.push(`\n### ${navItem.title}\n`);
        navItem.children?.forEach((navItemChild) => {
          const longTitle = navItemChild.title.split('.');
          const shortTitle = longTitle[longTitle.length - 1];
          navJson.push(
            `- [${shortTitle}](${parseUrl(encodeURI(navItemChild.url))})`,
          );
        });
      } else {
        const title = navItem.title;
        navJson.push(`- [${title}](${parseUrl(navItem.url)})`);
      }
    });

  fs.writeFileSync(outputDirectory + '/_Sidebar.md', navJson.join('\n') + '\n');
}

// ANSI color codes for console styling
const styles = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	cyan: '\x1b[36m',
	yellow: '\x1b[33m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	magenta: '\x1b[35m'
};

// ASCII art for "Talent Pool x LUMEN"
const asciiArt = `
████████╗ █████╗ ██╗     ███████╗███╗   ██╗████████╗██████╗  ██████╗  ██████╗ ██╗          ██╗  ██╗          ██╗     ██╗   ██╗███╗   ███╗███████╗███╗   ██╗
╚══██╔══╝██╔══██╗██║     ██╔════╝████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██╔═══██╗██║          ╚██╗██╔╝          ██║     ██║   ██║████╗ ████║██╔════╝████╗  ██║
   ██║   ███████║██║     █████╗  ██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║   ██║██║           ╚███╔╝           ██║     ██║   ██║██╔████╔██║█████╗  ██╔██╗ ██║
   ██║   ██╔══██║██║     ██╔══╝  ██║╚██╗██║   ██║   ██╔═══╝ ██║   ██║██║   ██║██║           ██╔██╗           ██║     ██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║
   ██║   ██║  ██║███████╗███████╗██║ ╚████║   ██║   ██║     ╚██████╔╝╚██████╔╝███████╗     ██║ ╚██╗          ███████╗╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ═╝      ╚═════╝  ╚═════╝ ╚══════╝      ╚═╝  ╚═╝          ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝
`;

console.clear();

// Display ASCII art with color
console.log(styles.cyan + asciiArt + styles.reset);

// Welcome message
console.log(styles.bright + 'Talentpool Software and Lumen (c) 2025 Immanuel Garcia (AlexDev404)' + styles.reset);

// Copyright and info with styling
console.log(
	'\n' +
		styles.bright +
		styles.green +
		'-----------------------------------------------------------' +
		styles.reset
);
console.log(styles.bright + styles.yellow + 'Womp, womp. You found me :)' + styles.reset);
console.log(
	styles.magenta +
		"Ain't gonna give you up, ain't gonna let you down, ain't gonna run around and desert you." +
		styles.reset
);
console.log(
	styles.bright +
		styles.green +
		'-----------------------------------------------------------' +
		styles.reset
);

console.log('\n' + styles.yellow + '📱 Connect:' + styles.reset);
console.log(styles.cyan + '- LinkedIn: ' + styles.reset + 'https://linkedin.com/in/alexdev404');
console.log(styles.cyan + '- GitHub:   ' + styles.reset + 'https://github.com/AlexDev404');

console.log(
	'\n' +
		styles.bright +
		styles.red +
		'💼 ' +
		styles.reset +
		styles.bright +
		'The creator of Talentpool Software is looking for a good job. Consider reaching out! 🚀' +
		styles.reset
);

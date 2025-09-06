import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper functions for templates
handlebars.registerHelper('formatDate', function(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

handlebars.registerHelper('capitalize', function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
});

// Load and compile templates
const loadTemplate = (templateName) => {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    return handlebars.compile(templateSource);
};

export { loadTemplate };
import os
import re

def update_permalinks(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Extract front-matter
                match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
                if match:
                    front_matter = match.group(1)
                    body = content[match.end():]
                    
                    # Create expected permalink from path
                    # source\_posts\SearchFile\网站\gmail.md -> SearchFile/网站/gmail.html
                    rel_path = os.path.relpath(file_path, r'e:\tmp\blog-cool\source\_posts')
                    permalink = rel_path.replace('\\', '/').replace('.md', '.html')
                    
                    # Check if permalink already exists
                    if 'permalink:' not in front_matter:
                        new_front_matter = front_matter + f'\npermalink: {permalink}'
                        new_content = f'---\n{new_front_matter}\n---\n{body}'
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated {file_path} with permalink: {permalink}")

if __name__ == "__main__":
    target_dir = r'e:\tmp\blog-cool\source\_posts\SearchFile'
    update_permalinks(target_dir)

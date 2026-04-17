import os
import re

source_dir = r'e:\tmp\blog-cool\source'
cover_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjT295-ekit0wFFak54ypSqgzls6rnBWxhrQ&s'
tag_value = 'ai'

def update_file(filepath):
    if not filepath.endswith('.md'):
        return

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    title = os.path.splitext(os.path.basename(filepath))[0]
    password = None
    
    # Check for front-matter
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    rest_of_content = content
    
    if match:
        old_front_matter = match.group(1)
        rest_of_content = content[match.end():]
        
        # Extract title
        title_match = re.search(r'^title:\s*(.*)$', old_front_matter, re.MULTILINE)
        if title_match:
            title = title_match.group(1).strip().strip('"').strip("'")
        
        # Extract password if present
        password_match = re.search(r'^password:\s*(.*)$', old_front_matter, re.MULTILINE)
        if password_match:
            password = password_match.group(1).strip()

    # Construct new front-matter
    new_lines = [
        '---',
        f'title: {title}',
        f'cover: {cover_url}',
        f'tag: {tag_value}'
    ]
    if password:
        new_lines.append(f'password: {password}')
    new_lines.append('---')
    
    new_content = '\n'.join(new_lines) + '\n' + rest_of_content

    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error writing {filepath}: {e}")

# Directories to process
target_dirs = [
    os.path.join(source_dir, '_posts'),
    os.path.join(source_dir, 'locked')
]

for t_dir in target_dirs:
    if os.path.exists(t_dir):
        for root, dirs, files in os.walk(t_dir):
            for file in files:
                update_file(os.path.join(root, file))

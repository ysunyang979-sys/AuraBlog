"""
核弹级路径重置脚本
==================
1. 删除所有手动 permalink（彻底清除之前脚本的污染）
2. 删除根目录下的重复文件（保留子目录中的版本）
3. 为每个文件分配基于真实文件路径的唯一 permalink
4. 扫描全站内部链接，自动将文件的 permalink 映射到链接目标
5. 恢复之前脚本修改过的内容中的链接
6. 验证零冲突
"""
import os
import re
from collections import defaultdict

POSTS_DIR = r"e:\tmp\blog-cool\source\_posts"

# ================================================================
# Phase 1: 读取所有文件，清除所有 permalink
# ================================================================
all_files = []
for root, dirs, fnames in os.walk(POSTS_DIR):
    for fname in fnames:
        if not fname.endswith('.md'):
            continue
        fpath = os.path.join(root, fname)
        rel = os.path.relpath(fpath, POSTS_DIR).replace('\\', '/')
        slug = os.path.splitext(fname)[0]

        with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        # 彻底清除所有 permalink 行
        content = re.sub(r'\r?\npermalink:[^\n]*', '', content)

        all_files.append({
            'path': fpath,
            'rel': rel,
            'slug': slug,
            'content': content,
            'permalink': None
        })

print(f"[Phase 1] 共加载 {len(all_files)} 个文件")

# ================================================================
# Phase 2: 恢复之前脚本对内容的破坏性修改
# ================================================================
for f in all_files:
    original = f['content']
    # 恢复 catalog.md / index.md 中被小写化的链接
    c = f['content']
    c = c.replace('/searchfile/', '/SearchFile/')
    c = c.replace('/sites/', '/网站/')
    c = c.replace('searchfile/', 'SearchFile/')
    if c != original:
        f['content'] = c
        print(f"[Phase 2] 恢复了 {f['slug']} 中的链接")

# ================================================================
# Phase 3: 删除根目录下的重复文件和垃圾文件
# ================================================================
by_slug = defaultdict(list)
for f in all_files:
    by_slug[f['slug'].lower()].append(f)

to_remove = set()
for slug, group in by_slug.items():
    if len(group) <= 1:
        continue
    root_files = [f for f in group if '/' not in f['rel']]
    sub_files = [f for f in group if '/' in f['rel']]
    if root_files and sub_files:
        for rf in root_files:
            to_remove.add(id(rf))
            print(f"[Phase 3] 删除重复: {rf['rel']}（保留 {sub_files[0]['rel']}）")
            try:
                os.remove(rf['path'])
            except:
                pass

# 删除垃圾文件
for f in all_files:
    if 'hello-world' in f['slug'].lower():
        to_remove.add(id(f))
        print(f"[Phase 3] 删除垃圾: {f['rel']}")
        try:
            os.remove(f['path'])
        except:
            pass

all_files = [f for f in all_files if id(f) not in to_remove]
print(f"[Phase 3] 清理后剩余 {len(all_files)} 个文件")

# ================================================================
# Phase 4: 为每个文件分配基于文件路径的自然 permalink（保证唯一）
# ================================================================
for f in all_files:
    f['permalink'] = os.path.splitext(f['rel'])[0] + '.html'

# ================================================================
# Phase 5: 扫描全站内部链接，将文件的 permalink 映射到链接目标
# ================================================================
all_links = set()
for f in all_files:
    links = re.findall(r'href="/(.*?\.html)"', f['content'])
    all_links.update(links)

print(f"[Phase 5] 发现 {len(all_links)} 个唯一内部链接")

# 构建当前 permalink 索引
perm_index = {}
for f in all_files:
    perm_index[f['permalink'].lower()] = f

# 对每个断裂的链接，尝试通过文件名匹配修复
remapped = 0
orphans = []
for link in sorted(all_links):
    if link.lower() in perm_index:
        continue  # 已经有对应文件

    link_slug = os.path.splitext(os.path.basename(link))[0].lower()
    link_dir = os.path.dirname(link).lower()

    candidates = [f for f in all_files if f['slug'].lower() == link_slug]

    if not candidates:
        orphans.append(link)
        continue

    # 如果只有一个候选，直接映射
    if len(candidates) == 1:
        chosen = candidates[0]
    else:
        # 多个候选时，尝试通过目录匹配
        chosen = None
        # 将 tools → SearchFile/tool 进行对照
        norm_link_dir = link_dir.replace('tools', 'searchfile/tool')
        for c in candidates:
            c_dir = os.path.dirname(c['rel']).lower()
            if norm_link_dir == c_dir or link_dir == c_dir:
                chosen = c
                break
        if not chosen:
            chosen = candidates[0]

    # 检查新 permalink 是否会冲突
    if link.lower() in perm_index and perm_index[link.lower()] != chosen:
        continue  # 跳过，避免冲突

    old_perm = chosen['permalink']
    perm_index.pop(old_perm.lower(), None)
    chosen['permalink'] = link
    perm_index[link.lower()] = chosen
    remapped += 1
    print(f"[Phase 5] 映射: {chosen['rel']} → {link}")

print(f"[Phase 5] 修复了 {remapped} 个断裂链接")
if orphans:
    print(f"[Phase 5] {len(orphans)} 个孤链（无对应文件）:")
    for o in orphans[:10]:
        print(f"  - {o}")

# ================================================================
# Phase 6: 最终冲突检测与解决
# ================================================================
final_check = defaultdict(list)
for f in all_files:
    final_check[f['permalink'].lower()].append(f)

conflicts = {k: v for k, v in final_check.items() if len(v) > 1}
resolved = 0
for perm, group in conflicts.items():
    print(f"[Phase 6] 冲突: {perm} 被 {len(group)} 个文件占用")
    # 保留第一个，其余回退到自然路径
    for extra in group[1:]:
        natural = os.path.splitext(extra['rel'])[0] + '.html'
        # 如果自然路径也冲突，在后面加序号
        suffix = 2
        candidate = natural
        while candidate.lower() in final_check and len(final_check[candidate.lower()]) > 0:
            base = os.path.splitext(natural)[0]
            candidate = f"{base}-{suffix}.html"
            suffix += 1
        extra['permalink'] = candidate
        resolved += 1
        print(f"  → {extra['rel']} 回退为 {candidate}")

if resolved:
    print(f"[Phase 6] 解决了 {resolved} 个冲突")

# ================================================================
# Phase 7: 写回所有文件
# ================================================================
written = 0
for f in all_files:
    content = f['content']

    # 定位 frontmatter
    m = re.match(r'^(---\s*\r?\n)(.*?)(\r?\n---)', content, re.DOTALL)
    if not m:
        continue

    header = m.group(1)
    fm_body = m.group(2)
    closer = m.group(3)
    rest = content[m.end():]

    # 清除可能残留的 permalink 行
    fm_lines = [l for l in fm_body.split('\n')
                if not l.strip().startswith('permalink:')]
    fm_lines.append(f"permalink: {f['permalink']}")

    new_fm = '\n'.join(l for l in fm_lines if l.strip())
    new_content = f"---\n{new_fm}\n---{rest}"

    with open(f['path'], 'w', encoding='utf-8') as fh:
        fh.write(new_content)
    written += 1

# ================================================================
# 最终报告
# ================================================================
final2 = defaultdict(list)
for f in all_files:
    final2[f['permalink'].lower()].append(f['rel'])
remaining = {k: v for k, v in final2.items() if len(v) > 1}

print(f"\n{'=' * 60}")
print(f"  处理文件数: {written}")
print(f"  剩余冲突数: {len(remaining)}")
if remaining:
    for p, fs in remaining.items():
        print(f"    {p}: {fs}")
else:
    print("  ✅ 零冲突！hexo s 应该可以正常启动了！")
print(f"{'=' * 60}")

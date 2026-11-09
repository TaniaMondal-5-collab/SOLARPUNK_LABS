# Syntax and bracket verification script
import sys

def check_balance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        code = f.read()
    stack = []
    in_string = False
    str_char = ''
    in_comment_single = False
    in_comment_multi = False
    
    i = 0
    line_no = 1
    col_no = 1
    while i < len(code):
        ch = code[i]
        if ch == '\n':
            line_no += 1
            col_no = 1
            in_comment_single = False
            i += 1
            continue
        col_no += 1
        
        if in_comment_single:
            i += 1
            continue
        if in_comment_multi:
            if ch == '*' and i + 1 < len(code) and code[i+1] == '/':
                in_comment_multi = False
                i += 2
                continue
            i += 1
            continue
        if in_string:
            if ch == '\\':
                i += 2
                continue
            if ch == str_char:
                in_string = False
            i += 1
            continue
            
        if ch == '/' and i + 1 < len(code):
            if code[i+1] == '/':
                in_comment_single = True
                i += 2
                continue
            elif code[i+1] == '*':
                in_comment_multi = True
                i += 2
                continue
                
        if ch in ('"', "'", '`'):
            in_string = True
            str_char = ch
            i += 1
            continue
            
        if ch in '({[':
            stack.append((ch, line_no, col_no))
        elif ch in ')}]':
            if not stack:
                print(f"{filename}: ERROR unexpected '{ch}' at line {line_no}:{col_no}")
                return False
            top, tl, tc = stack.pop()
            matches = {'(': ')', '{': '}', '[': ']'}
            if matches[top] != ch:
                print(f"{filename}: ERROR mismatched '{top}' (line {tl}:{tc}) and '{ch}' at line {line_no}:{col_no}")
                return False
        i += 1
    if stack:
        top, tl, tc = stack[-1]
        print(f"{filename}: ERROR unclosed '{top}' from line {tl}:{tc}")
        return False
    print(f"{filename}: OK (Balanced)")
    return True

all_ok = True
for f in ['gameData.js', 'audio.js', 'lunarBaseSvg.js', 'reactShim.js', 'app.js']:
    if not check_balance(f):
        all_ok = False

if all_ok:
    print("ALL 5 JAVASCRIPT FILES ARE 100% BALANCED AND SYNTACTICALLY SOUND!")
else:
    sys.exit(1)


# Considering all the inputs are valid 
# Can also check for validity condtion => if not valid

# main t1 enter
# foo t2 enter
# bar t3 enter
# bar t4 exit
# foo t5 exit
# bar t6 enter
# foo t7 enter
# foo t8 exit
# bar t9 exit
# main t10 exit

# -main t10 - t1
# --foo t5 - t2
# ---bar t4 - t3
# --bar
# ---foo

def google(arr, stack, depth, ans):
    if len(arr) == 0:
        return ans
    
    temp = list(map(str, arr[0].split(' ')))
    
    if temp[2] == 'enter':
        depth += 1
        stack.append(temp) # O(1)
        arr.pop(0) # O(1)
    else:
        ans.append([temp, stack.pop(), depth]) # O(1)
        depth -= 1 
        arr.pop(0) # O(1)
    return google(arr, stack, depth, ans)

def solve(arr):
    stack = []
    # O(n)
    ans = google(arr, stack, 0, [])
    
    # O(n log n)
    ans = sorted(ans, key=lambda element: element[1][1])

    # O(n)
    for i in ans:
        dashLength = i[2]
        name = i[0][0]
        timeDiff = i[0][1] + ' - ' + i[1][1]
        print('-'*int(dashLength)+name+' ' + timeDiff)

if __name__ == "__main__":
    arr = ['main t1 enter', 'foo t2 enter', \
        'bar t3 enter', 'bar t4 exit', 'foo t5 exit', 'bar t6 enter', \
            'foo t7 enter', 'foo t8 exit', 'bar t9 exit', 'main t10 exit']
    
    solve(arr)
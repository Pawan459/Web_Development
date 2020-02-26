if __name__ == '__main__':
    books, lib, days = map(int, input().split(' '))
    books_score = list(map(int, input().split(' ')))
    
    lib_det = []
    
    for i in range(len(lib)):
        lb = []
        lb.append([i]+list(map(int, input().split(' '))))
        lb.append(list(map(int, input().split(' '))))
        lib_det.append(lb)
        
    
        